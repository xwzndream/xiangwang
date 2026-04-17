export default async function handler(req) {
  if (req.method !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { contact, services, total, deposit, message, timestamp } = JSON.parse(req.body);

    console.log("新线索:", { contact, services, total, deposit, message, timestamp });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error("提交失败:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "提交失败" })
    };
  }
}
