import { createClient } from "@supabase/supabase-js";

const DEPLOYABLE_PACKAGE = "静态官网 / 个人落地页";

export default async function handler(req) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const { contact, services, total, paymentRule, upfrontPayment, message, timestamp } = await req.json();
    if (!contact?.trim()) return Response.json({ error: "请填写联系方式" }, { status: 400 });
    const selectedServices = Array.isArray(services) ? services : [];
    const deploymentEligible = selectedServices.includes(DEPLOYABLE_PACKAGE);
    const cleanContact = contact.trim();
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
      let { data: customer } = await db.from("customers").select("id").eq("contact", cleanContact).maybeSingle();
      if (!customer) {
        const created = await db.from("customers").insert({ name: `咨询客户 · ${cleanContact}`, contact: cleanContact, status: "new" }).select("id").single();
        if (created.error) throw created.error;
        customer = created.data;
      }
      const lead = await db.from("leads").insert({
        customer_id: customer.id, contact: cleanContact, services: selectedServices, total: Number(total || 0),
        payment_rule: paymentRule || "待确认", upfront_payment: Number(upfrontPayment || 0), message: message?.trim() || "",
        deployment_eligible: deploymentEligible, created_at: timestamp || new Date().toISOString(),
      });
      if (lead.error) throw lead.error;
    } else {
      console.warn("Supabase 尚未配置，本次咨询只发送通知，未写入后台档案。");
    }

    const pushKey = process.env.PUSHDEER_KEY;
    if (pushKey) {
      const desp = ["向往软件工作室收到一条新的项目咨询", "", `客户联系方式：${cleanContact}`, `服务项：${selectedServices.length ? selectedServices.join("、") : "待沟通"}`, `起步估价：¥${Number(total || 0).toLocaleString("zh-CN")}`, `部署类型：${deploymentEligible ? "静态官网，可进入部署管理" : "其他类型，暂不需要部署"}`, `需求备注：${message?.trim() || "无"}`, `提交时间：${timestamp || new Date().toISOString()}`].join("\n");
      const response = await fetch("https://api2.pushdeer.com/message/push", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ pushkey:pushKey, text:"新客户项目咨询", desp, type:"markdown" }) });
      if (!response.ok) console.error("PushDeer 推送失败：", await response.text());
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("咨询提交失败：", error instanceof Error ? error.message : error);
    return Response.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  }
}
