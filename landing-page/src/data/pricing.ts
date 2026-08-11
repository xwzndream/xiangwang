export interface ServiceItem {
  name: string;
  price: number;
  description: string;
  includes?: string[];
  startingAt?: boolean;
}

export const corePackages: ServiceItem[] = [
  {
    name: "静态官网 / 个人落地页",
    price: 1000,
    description: "适合个人作品集、企业展示、引流官网与单页落地页",
    includes: ["AI 自适应官网", "手机电脑适配", "基础内容排版", "Netlify 云端部署"]
  },
  {
    name: "轻量化工具开发",
    price: 8000,
    startingAt: true,
    description: "适合办公自动化、批量处理、内部工具与数据辅助",
    includes: ["Windows / Mac 工具", "浏览器插件", "工具类小程序", "完整源码交付"]
  },
  {
    name: "移动端 APP",
    price: 10000,
    startingAt: true,
    description: "仅承接工具类、内部业务类 APP，不做高 UI 需求项目",
    includes: ["Android / iOS", "核心功能开发", "完整调试", "源码交付"]
  },
  {
    name: "后端自动化 / AI 智能服务",
    price: 6000,
    startingAt: true,
    description: "适合自动化、数据处理、API 与轻量化 AI 后台",
    includes: ["自动化脚本", "数据采集清洗", "API 接口", "视频 / 文件批处理"]
  }
];

export const extraServices: ServiceItem[] = [
  { name: "AI 模型专项训练", price: 10000, startingAt: true, description: "模型微调与推理部署，客户提供数据集" },
  { name: "项目修改 / 内容更新 / 重新部署", price: 500, description: "按次计费" },
  { name: "开发者账号协助注册", price: 500, description: "按账号计费" },
  { name: "小程序上架协助", price: 400, description: "协助准备并提交上架材料" },
  { name: "浏览器插件商店上架", price: 800, description: "Chrome / Edge 商店上架协助" },
  { name: "新增独立功能", price: 1000, startingAt: true, description: "按功能复杂度最终确认" },
  { name: "服务器环境部署调试", price: 1500, startingAt: true, description: "通常为 ¥1,500–2,000" }
];

export const allServices = [...corePackages, ...extraServices];

export const contact = {
  name: "向先生",
  phone: "17521217112",
  wechat: "17521217112"
};

export function toggleServiceSelection(current: string[], name: string): string[] {
  return current.includes(name) ? current.filter(item => item !== name) : [...current, name];
}

export function calculateQuote(selected: string[]) {
  const total = selected.reduce((sum, name) => {
    const item = allServices.find(service => service.name === name);
    return sum + (item?.price ?? 0);
  }, 0);
  const isLargeProject = total >= 10000;

  return {
    total,
    paymentRule: isLargeProject ? "50% 预付款，验收后支付尾款" : "一次性全款，确认付款后开工",
    upfrontPayment: isLargeProject ? total * 0.5 : total
  };
}

export function formatPrice(item: ServiceItem): string {
  return `¥${item.price.toLocaleString("zh-CN")}${item.startingAt ? " 起" : ""}`;
}
