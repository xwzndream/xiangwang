import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const callbackUrl = provider => `${process.env.URL}/.netlify/functions/provider-auth?provider=${provider}&callback=1`;
const stateFor = provider => crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(provider).digest("hex");
const authenticated = req => {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").map(value => value.trim()).find(value => value.startsWith("xw_admin_session="))?.split("=")[1];
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const [payload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(payload || "").digest("base64url");
  if (!payload || signature !== expected) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now(); } catch { return false; }
};
const encrypt = value => {
  const key = crypto.createHash("sha256").update(process.env.AUTH_ENCRYPTION_KEY || "").digest();
  const iv = crypto.randomBytes(12); const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${encrypted.toString("base64")}`;
};

export default async function handler(req) {
  const url = new URL(req.url); const provider = url.searchParams.get("provider");
  if (!authenticated(req)) return Response.redirect(`${process.env.URL}/admin`, 302);
  if (!['github','netlify'].includes(provider)) return new Response("Invalid provider", { status:400 });
  if (!url.searchParams.get("callback")) {
    const clientId = process.env[provider === "github" ? "GITHUB_OAUTH_CLIENT_ID" : "NETLIFY_OAUTH_CLIENT_ID"];
    if (!clientId) return new Response(`${provider} OAuth 尚未配置`, { status:503 });
    const target = provider === "github"
      ? `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user:email&redirect_uri=${encodeURIComponent(callbackUrl(provider))}&state=${stateFor(provider)}`
      : `https://app.netlify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(callbackUrl(provider))}&state=${stateFor(provider)}`;
    return Response.redirect(target, 302);
  }
  if (url.searchParams.get("state") !== stateFor(provider)) return new Response("OAuth state invalid", { status:403 });
  try {
    if (!process.env.AUTH_ENCRYPTION_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("授权安全环境变量尚未配置");
    const code = url.searchParams.get("code");
    const clientId = process.env[provider === "github" ? "GITHUB_OAUTH_CLIENT_ID" : "NETLIFY_OAUTH_CLIENT_ID"];
    const clientSecret = process.env[provider === "github" ? "GITHUB_OAUTH_CLIENT_SECRET" : "NETLIFY_OAUTH_CLIENT_SECRET"];
    const tokenResponse = await fetch(provider === "github" ? "https://github.com/login/oauth/access_token" : "https://api.netlify.com/oauth/token", {
      method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify(provider === "github" ? {client_id:clientId,client_secret:clientSecret,code,redirect_uri:callbackUrl(provider)} : {grant_type:"authorization_code",code,client_id:clientId,client_secret:clientSecret,redirect_uri:callbackUrl(provider)}),
    });
    const tokenData = await tokenResponse.json(); const token = tokenData.access_token;
    if (!token) throw new Error("未取得访问令牌");
    const profileResponse = await fetch(provider === "github" ? "https://api.github.com/user" : "https://api.netlify.com/api/v1/user", {headers:{Authorization:`Bearer ${token}`,Accept:"application/json","User-Agent":"Xiangwang-Admin"}});
    const profile = await profileResponse.json();
    const accountId = String(profile.id || profile.uid || profile.email); const accountName = profile.login || profile.full_name || profile.email || accountId;
    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});
    await db.from("provider_connections").upsert({provider,account_id:accountId,account_name:accountName,encrypted_token:encrypt(token),is_default:true,status:"active",updated_at:new Date().toISOString()},{onConflict:"provider,account_id"});
    return Response.redirect(`${process.env.URL}/admin?authorized=${provider}`,302);
  } catch (error) { console.error("provider-auth:",error); return new Response("授权失败，请返回后台重试",{status:500}); }
}
