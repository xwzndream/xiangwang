export default async function handler(req) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const { contact, services, total, paymentRule, upfrontPayment, message, timestamp } = await req.json();
    if (!contact?.trim()) return Response.json({ error: "请填写联系方式" }, { status: 400 });
    const pushKey = process.env.PUSHDEER_KEY;
    if (!pushKey) {
      console.error("未配置 PUSHDEER_KEY，拒绝返回虚假成功状态");
      return Response.json({ error: "通知服务未配置" }, { status: 503 });
    }
    const desp = ["向往软件工作室收到一条新的项目咨询", "", "负责人：向先生", `客户联系方式：${contact.trim()}`, `服务项：${Array.isArray(services) && services.length ? services.join("、") : "待沟通"}`, `起步估价：¥${Number(total || 0).toLocaleString("zh-CN")}`, `付款规则：${paymentRule || "待确认"}`, `开工款：¥${Number(upfrontPayment || 0).toLocaleString("zh-CN")}`, `需求备注：${message?.trim() || "无"}`, `提交时间：${timestamp || new Date().toISOString()}`].join("\n");
    const pushResponse = await fetch("https://api2.pushdeer.com/message/push", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ pushkey:pushKey, text:"新客户项目咨询", desp, type:"markdown" }) });
    if (!pushResponse.ok) {
      console.error("PushDeer 推送失败:", await pushResponse.text());
      return Response.json({ error: "通知发送失败" }, { status: 502 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("提交失败:", error);
    return Response.json({ error: "提交失败" }, { status: 500 });
  }
}
