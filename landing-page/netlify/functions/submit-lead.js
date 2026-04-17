export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { contact, services, total, deposit, message, timestamp, viewCounts } = await req.json();
    const pushKey = process.env.PUSHDEER_KEY;

    console.log("新线索:", { contact, services, total, deposit, message, timestamp, viewCounts });

    if (pushKey) {
      const serviceText = Array.isArray(services) && services.length > 0 ? services.join("、") : "未选择";
      const viewText = viewCounts && Object.keys(viewCounts).length > 0
        ? Object.entries(viewCounts)
            .map(([name, count]) => `${name}: ${count}`)
            .join("\n")
        : "无";

      const desp = [
        "收到一条新的咨询留言",
        "",
        `联系方式：${contact || "未填写"}`,
        `服务项：${serviceText}`,
        `总价：¥${Number(total || 0).toLocaleString("zh-CN")}`,
        `预付：¥${Number(deposit || 0).toLocaleString("zh-CN")}`,
        `视图数：\n${viewText}`,
        `备注：${message?.trim() || "无"}`,
        `时间：${timestamp || new Date().toISOString()}`
      ].join("\n");

      try {
        const pushResponse = await fetch("https://api2.pushdeer.com/message/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pushkey: pushKey,
            text: "新客户咨询",
            desp,
            type: "markdown"
          })
        });

        if (!pushResponse.ok) {
          const pushError = await pushResponse.text();
          console.error("PushDeer 推送失败:", pushError);
        }
      } catch (pushError) {
        console.error("PushDeer 请求失败:", pushError);
      }
    } else {
      console.warn("未配置 PUSHDEER_KEY，已跳过微信推送");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("提交失败:", error);
    return Response.json({ error: "提交失败" }, { status: 500 });
  }
}
