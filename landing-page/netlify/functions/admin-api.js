import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const json = (body, status = 200, headers = {}) => Response.json(body, { status, headers });
const cookieName = "xw_admin_session";

function database() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("后台数据库尚未配置");
  return createClient(url, key, { auth: { persistSession: false } });
}

function sign(value) {
  return crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(value).digest("base64url");
}

function createSession(username) {
  const payload = Buffer.from(JSON.stringify({ username, exp: Date.now() + 7 * 86400000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function authenticated(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.split("=")[1];
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now(); } catch { return false; }
}

async function rows(client, table, order = "created_at") {
  const { data, error } = await client.from(table).select("*").order(order, { ascending: false });
  if (error) throw error;
  return data || [];
}

export default async function handler(req) {
  const action = new URL(req.url).searchParams.get("action") || "dashboard";
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  try {
    if (action === "login" && req.method === "POST") {
      const { username, password } = await req.json();
      const expectedUser = process.env.ADMIN_USERNAME || "admin";
      const expectedHash = process.env.ADMIN_PASSWORD_HASH || "";
      const actualHash = crypto.createHash("sha256").update(String(password || "")).digest("hex");
      const validHash = expectedHash.length === actualHash.length && crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(actualHash));
      if (username !== expectedUser || !validHash || !process.env.ADMIN_SESSION_SECRET) return json({ error: "账号或密码错误" }, 401);
      return json({ success: true }, 200, { "Set-Cookie": `${cookieName}=${createSession(username)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800` });
    }
    if (action === "logout") return json({ success: true }, 200, { "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
    if (!authenticated(req)) return json({ error: "未登录或登录已过期" }, 401);
    const client = database();
    if (action === "dashboard" && req.method === "GET") {
      const [customers, leads, projects] = await Promise.all([
        rows(client, "customers"), rows(client, "leads"), rows(client, "projects"),
      ]);
      return json({ customers, leads, projects });
    }
    if (action === "customers" && req.method === "POST") {
      const input = await req.json();
      const { data, error } = await client.from("customers").insert({ name: input.name, contact: input.contact, notes: input.notes || "", status: "active" }).select().single();
      if (error) throw error;
      return json(data, 201);
    }
    if (action === "projects" && req.method === "POST") {
      const input = await req.json();
      const delivered = input.delivered_at ? new Date(input.delivered_at) : null;
      const projectType = input.project_type === "landing_page" ? "landing_page" : "other";
      const expires = delivered && projectType === "landing_page" ? new Date(delivered.getTime() + 30 * 86400000).toISOString() : null;
      const { data, error } = await client.from("projects").insert({ customer_id: input.customer_id, name: input.name, project_type: projectType, deployment_enabled: projectType === "landing_page", status: delivered ? "delivered" : "development", delivered_at: delivered?.toISOString() || null, service_expires_at: expires }).select().single();
      if (error) throw error;
      return json(data, 201);
    }
    if (action === "project-action" && req.method === "POST") {
      const { id, operation } = await req.json();
      let changes = {};
      if (operation === "offline") changes = { status: "offline", offline_at: new Date().toISOString() };
      if (operation === "deliver") {
        const { data: project, error: projectError } = await client.from("projects").select("project_type").eq("id", id).single();
        if (projectError) throw projectError;
        const deliveredAt = new Date();
        changes = {
          status: "delivered",
          delivered_at: deliveredAt.toISOString(),
          service_expires_at: project.project_type === "landing_page" ? new Date(deliveredAt.getTime() + 30 * 86400000).toISOString() : null,
        };
      }
      if (operation === "complete") changes = { status: "completed" };
      if (!Object.keys(changes).length) return json({ error: "不支持的项目操作" }, 400);
      const { error } = await client.from("projects").update(changes).eq("id", id);
      if (error) throw error;
      return json({ success: true });
    }
    return json({ error: "不支持的操作" }, 404);
  } catch (error) {
    console.error("admin-api:", error instanceof Error ? error.message : error);
    return json({ error: error instanceof Error ? error.message : "后台服务异常" }, 500);
  }
}
