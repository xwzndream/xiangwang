import { useEffect, useState } from "react";
import {
  App as AntApp, Button, Card, Col, ConfigProvider, DatePicker, Descriptions, Drawer,
  Form, Input, Layout, Menu, Modal, Row, Select, Space, Statistic, Table, Tag, Typography, message,
} from "antd";
import {
  AppstoreOutlined, BellOutlined, CloudUploadOutlined, CodeOutlined, CustomerServiceOutlined,
  DeploymentUnitOutlined, GithubOutlined, LogoutOutlined, PlusOutlined, ProjectOutlined,
  SafetyCertificateOutlined, TeamOutlined,
} from "@ant-design/icons";
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "./admin.css";

type Customer = { id:string; name:string; contact:string; status:string; created_at:string; notes?:string };
type Lead = { id:string; contact:string; services:string[]; total:number; status:string; deployment_eligible:boolean; created_at:string };
type Project = { id:string; customer_id:string; name:string; project_type:string; deployment_enabled:boolean; status:string; service_expires_at?:string; github_repo?:string; netlify_site_url?:string; offline_at?:string };
type Connection = { id:string; provider:string; account_name:string; is_default:boolean; status:string };
type Dashboard = { customers:Customer[]; leads:Lead[]; projects:Project[]; connections:Connection[] };

async function api(action:string, options:RequestInit = {}) {
  const response = await fetch(`/.netlify/functions/admin-api?action=${encodeURIComponent(action)}`, {
    credentials:"include", headers:{"Content-Type":"application/json", ...(options.headers || {})}, ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

function AdminApp() {
  const [authenticated,setAuthenticated] = useState<boolean|null>(null);
  const [data,setData] = useState<Dashboard>({customers:[],leads:[],projects:[],connections:[]});
  const [section,setSection] = useState("dashboard");
  const [loading,setLoading] = useState(false);
  const [drawer,setDrawer] = useState<"customer"|"project"|null>(null);
  const [loginForm] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [messageApi,contextHolder] = message.useMessage();

  const load = async () => {
    setLoading(true);
    try { setData(await api("dashboard")); setAuthenticated(true); }
    catch (error) { if ((error as Error).message.includes("未登录")) setAuthenticated(false); else messageApi.error((error as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const login = async (values:{username:string,password:string}) => {
    setLoading(true);
    try { await api("login",{method:"POST",body:JSON.stringify(values)}); await load(); }
    catch (error) { messageApi.error((error as Error).message); setLoading(false); }
  };
  const logout = async () => { await api("logout",{method:"POST"}); setAuthenticated(false); };
  const createCustomer = async (values:Record<string,string>) => {
    await api("customers",{method:"POST",body:JSON.stringify(values)}); customerForm.resetFields(); setDrawer(null); await load(); messageApi.success("客户已建立档案");
  };
  const createProject = async (values:Record<string,string>) => {
    await api("projects",{method:"POST",body:JSON.stringify({...values, delivered_at:values.delivered_at ? dayjs(values.delivered_at).toISOString() : null})});
    projectForm.resetFields(); setDrawer(null); await load(); messageApi.success("项目已创建");
  };
  const projectAction = async (project:Project, action:string) => {
    Modal.confirm({title:action === "offline" ? "确认下架项目？" : "确认更新项目状态？",content:`项目：${project.name}`,okText:"确认",cancelText:"取消",async onOk(){await api("project-action",{method:"POST",body:JSON.stringify({id:project.id,operation:action})});await load();}});
  };

  if (authenticated === null) return <div className="admin-loading">正在加载后台管理系统…</div>;
  if (!authenticated) return <ConfigProvider locale={locale} theme={{token:{colorPrimary:"#1747e8",borderRadius:8}}}><AntApp>{contextHolder}<main className="admin-login"><Card className="login-card"><div className="login-mark">XW</div><Typography.Title level={2}>向往工作室</Typography.Title><Typography.Paragraph type="secondary">后台管理系统 · 仅限管理员</Typography.Paragraph><Form form={loginForm} layout="vertical" onFinish={login}><Form.Item name="username" label="管理员账号" rules={[{required:true}]}><Input size="large" autoComplete="username"/></Form.Item><Form.Item name="password" label="密码" rules={[{required:true}]}><Input.Password size="large" autoComplete="current-password"/></Form.Item><Button block size="large" type="primary" htmlType="submit" loading={loading}>安全登录</Button></Form></Card></main></AntApp></ConfigProvider>;

  const expired = data.projects.filter(p => p.service_expires_at && dayjs(p.service_expires_at).isBefore(dayjs()) && !p.offline_at);
  const deletionDue = data.projects.filter(p => p.offline_at && dayjs(p.offline_at).add(30,"day").isBefore(dayjs()));
  const menu = [
    {key:"dashboard",icon:<AppstoreOutlined/>,label:"工作台"},{key:"customers",icon:<TeamOutlined/>,label:"客户管理"},
    {key:"leads",icon:<CustomerServiceOutlined/>,label:"咨询记录"},{key:"projects",icon:<ProjectOutlined/>,label:"项目管理"},
    {key:"connections",icon:<SafetyCertificateOutlined/>,label:"授权管理"},{key:"deployments",icon:<DeploymentUnitOutlined/>,label:"部署记录"},
  ];
  const customerColumns = [{title:"客户",dataIndex:"name"},{title:"联系方式",dataIndex:"contact"},{title:"状态",dataIndex:"status",render:(v:string)=><Tag color="blue">{v}</Tag>},{title:"建档时间",dataIndex:"created_at",render:(v:string)=>dayjs(v).format("YYYY-MM-DD HH:mm")}];
  const leadColumns = [{title:"联系方式",dataIndex:"contact"},{title:"咨询服务",dataIndex:"services",render:(v:string[])=>(v||[]).join("、")},{title:"估价",dataIndex:"total",render:(v:number)=>`¥${Number(v||0).toLocaleString()}`},{title:"部署资格",dataIndex:"deployment_eligible",render:(v:boolean)=>v?<Tag color="green">静态官网可部署</Tag>:<Tag>无需部署</Tag>},{title:"状态",dataIndex:"status",render:(v:string)=><Tag>{v}</Tag>},{title:"提交时间",dataIndex:"created_at",render:(v:string)=>dayjs(v).format("YYYY-MM-DD HH:mm")}];
  const projectColumns = [{title:"项目",dataIndex:"name"},{title:"类型",dataIndex:"project_type",render:(v:string)=>v==="landing_page"?"静态官网 / 个人落地页":"其他项目"},{title:"状态",dataIndex:"status",render:(v:string)=><Tag color={v==="active"?"green":"orange"}>{v}</Tag>},{title:"免费管理到期",dataIndex:"service_expires_at",render:(v:string)=>v?dayjs(v).format("YYYY-MM-DD"):"未交付"},{title:"代码仓库",dataIndex:"github_repo",render:(v:string)=>v?<a href={v} target="_blank">GitHub</a>:"未关联"},{title:"网站",dataIndex:"netlify_site_url",render:(v:string)=>v?<a href={v} target="_blank">打开</a>:"未关联"},{title:"操作",render:(_:unknown,p:Project)=><Space>{p.deployment_enabled&&<Button size="small" icon={<CloudUploadOutlined/>}>更新部署</Button>}{p.deployment_enabled&&<Button size="small" danger onClick={()=>projectAction(p,"offline")}>下架</Button>}{!p.deployment_enabled&&<Tag>暂不需要部署</Tag>}</Space>}];

  const content = section === "customers" ? <Card title="客户管理" extra={<Button type="primary" icon={<PlusOutlined/>} onClick={()=>setDrawer("customer")}>新建客户</Button>}><Table rowKey="id" loading={loading} dataSource={data.customers} columns={customerColumns}/></Card>
    : section === "leads" ? <Card title="咨询记录"><Table rowKey="id" loading={loading} dataSource={data.leads} columns={leadColumns}/></Card>
    : section === "projects" ? <Card title="项目管理" extra={<Button type="primary" icon={<PlusOutlined/>} onClick={()=>setDrawer("project")}>新建项目</Button>}><Table rowKey="id" loading={loading} dataSource={data.projects} columns={projectColumns} scroll={{x:900}}/></Card>
    : section === "connections" ? <Card title="授权管理"><Typography.Paragraph>工作室账号作为默认授权；客户购买增值服务后，可以为指定项目绑定客户自己的账号。</Typography.Paragraph><Row gutter={16}>{["github","netlify"].map(provider=>{const connection=data.connections.find(c=>c.provider===provider&&c.is_default);return <Col span={12} key={provider}><Card><Space direction="vertical"><Typography.Title level={4}>{provider==="github"?<GithubOutlined/>:<CodeOutlined/>} {provider.toUpperCase()}</Typography.Title><Tag color={connection?"green":"default"}>{connection?`已授权：${connection.account_name}`:"尚未授权"}</Tag><Button type="primary" href={`/.netlify/functions/provider-auth?provider=${provider}`}>授权或重新授权</Button></Space></Card></Col>})}</Row></Card>
    : section === "deployments" ? <Card title="部署记录"><Typography.Text type="secondary">项目部署记录将在执行 GitHub/Netlify 操作后显示在这里。</Typography.Text></Card>
    : <Space direction="vertical" size={20} style={{width:"100%"}}><Row gutter={16}><Col span={6}><Card><Statistic title="客户总数" value={data.customers.length} prefix={<TeamOutlined/>}/></Card></Col><Col span={6}><Card><Statistic title="新咨询" value={data.leads.filter(l=>l.status==="new").length} prefix={<CustomerServiceOutlined/>}/></Card></Col><Col span={6}><Card><Statistic title="管理项目" value={data.projects.length} prefix={<ProjectOutlined/>}/></Card></Col><Col span={6}><Card><Statistic title="待处理提醒" value={expired.length+deletionDue.length} valueStyle={{color:"#cf1322"}} prefix={<BellOutlined/>}/></Card></Col></Row><Card title="需要尽快处理"><Space direction="vertical">{expired.map(p=><Tag color="red" key={p.id}>{p.name} 免费管理已到期</Tag>)}{deletionDue.map(p=><Tag color="volcano" key={p.id}>{p.name} 下架已满30天，请确认删除代码</Tag>)}{!expired.length&&!deletionDue.length&&<Typography.Text type="secondary">当前没有到期事项</Typography.Text>}</Space></Card><Card title="最近咨询"><Table rowKey="id" pagination={false} dataSource={data.leads.slice(0,5)} columns={leadColumns}/></Card></Space>;

  return <ConfigProvider locale={locale} theme={{token:{colorPrimary:"#1747e8",borderRadius:8}}}><AntApp>{contextHolder}<Layout className="admin-shell"><Layout.Sider width={230} theme="dark"><div className="admin-brand"><b>向往工作室</b><span>后台管理系统</span></div><Menu theme="dark" selectedKeys={[section]} items={menu} onClick={({key})=>setSection(key)}/><Button className="logout-button" type="text" icon={<LogoutOutlined/>} onClick={logout}>退出登录</Button></Layout.Sider><Layout><Layout.Header className="admin-header"><Typography.Title level={4}>向先生，欢迎回来</Typography.Title><Tag color="blue">管理员</Tag></Layout.Header><Layout.Content className="admin-content">{content}</Layout.Content></Layout></Layout>
  <Drawer title="新建客户" open={drawer==="customer"} onClose={()=>setDrawer(null)}><Form form={customerForm} layout="vertical" onFinish={createCustomer}><Form.Item name="name" label="客户称呼" rules={[{required:true}]}><Input/></Form.Item><Form.Item name="contact" label="电话或微信" rules={[{required:true}]}><Input/></Form.Item><Form.Item name="notes" label="备注"><Input.TextArea rows={4}/></Form.Item><Button block type="primary" htmlType="submit">保存客户</Button></Form></Drawer>
  <Drawer title="新建项目" open={drawer==="project"} onClose={()=>setDrawer(null)}><Form form={projectForm} layout="vertical" initialValues={{project_type:"landing_page"}} onFinish={createProject}><Form.Item name="customer_id" label="所属客户" rules={[{required:true}]}><Select showSearch optionFilterProp="label" options={data.customers.map(customer=>({value:customer.id,label:`${customer.name} · ${customer.contact}`}))}/></Form.Item><Form.Item name="name" label="项目名称" rules={[{required:true}]}><Input/></Form.Item><Form.Item name="project_type" label="项目类型" rules={[{required:true}]}><Select options={[{value:"landing_page",label:"静态官网 / 个人落地页（支持部署）"},{value:"other",label:"其他类型（暂不部署）"}]}/></Form.Item><Form.Item name="delivered_at" label="交付日期"><DatePicker style={{width:"100%"}}/></Form.Item><Form.Item name="github_repo" label="GitHub 仓库"><Input/></Form.Item><Form.Item name="netlify_site_url" label="Netlify 网站"><Input/></Form.Item><Button block type="primary" htmlType="submit">保存项目</Button></Form></Drawer></AntApp></ConfigProvider>;
}

export default AdminApp;
