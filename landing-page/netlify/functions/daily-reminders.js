import { createClient } from "@supabase/supabase-js";

export default async function handler() {
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});
  const now = new Date(); const today = now.toISOString().slice(0,10);
  const { data: projects, error } = await db.from("projects").select("id,name,status,service_expires_at,offline_at");
  if (error) return new Response(error.message,{status:500});
  const reminders = (projects || []).flatMap(project => {
    const items=[];
    if (project.status !== "offline" && project.service_expires_at && new Date(project.service_expires_at) < now) items.push({type:"service_expired",text:`${project.name} 免费管理已到期，请尽快处理或下架`});
    if (project.offline_at && new Date(project.offline_at).getTime()+30*86400000 < now.getTime()) items.push({type:"delete_due",text:`${project.name} 下架已满30天，请确认备份并删除 GitHub 代码`});
    return items.map(item=>({...item,project_id:project.id}));
  });
  for (const reminder of reminders) {
    const key=`${today}:${reminder.project_id}:${reminder.type}`;
    const {error:logError}=await db.from("reminder_logs").insert({dedupe_key:key,project_id:reminder.project_id,type:reminder.type});
    if (logError) continue;
    await fetch("https://api2.pushdeer.com/message/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pushkey:process.env.PUSHDEER_KEY,text:"后台管理系统到期提醒",desp:reminder.text,type:"markdown"})});
  }
  return Response.json({sent:reminders.length});
}

export const config = { schedule: "0 1 * * *" };
