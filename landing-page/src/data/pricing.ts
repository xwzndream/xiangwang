export interface ServiceItem {
  name: string;
  price: number;
  type?: "view";
  base?: number;
  note?: string;
}

export const VIEW_BASE = 50;
export const VIEW_STEP_PRICE = 200;

export const pricingData: {
  client: ServiceItem[];
  server: ServiceItem[];
  extra: ServiceItem[];
} = {
  client: [
    { name: "UI设计", price: 10000, type: "view", base: VIEW_BASE },
    { name: "Android", price: 10000, type: "view", base: VIEW_BASE },
    { name: "iOS", price: 10000, type: "view", base: VIEW_BASE },
    { name: "Web", price: 10000, type: "view", base: VIEW_BASE }
  ],
  server: [
    { name: "API", price: 10000 },
    { name: "Admin", price: 10000 }
  ],
  extra: [
    { name: "上架", price: 5000, note: "仅服务费，不含账号与材料费，敏感性 App 不能保证一定上架" }
  ]
};

export const contact = {
  phone: "17521217112",
  wechat: "17521217112"
};

export function getDefaultViewCount(name: string): number {
  const item = pricingData.client.find(service => service.name === name);
  return item?.base ?? VIEW_BASE;
}

export function getServicePrice(
  item: ServiceItem,
  _selectedServices: string[],
  viewCounts: Record<string, number>
): number {
  if (item.type === "view") {
    const baseViews = item.base ?? VIEW_BASE;
    const currentViews = Math.max(1, viewCounts[item.name] ?? viewCounts.UI设计 ?? baseViews);
    const extraViews = Math.max(0, currentViews - baseViews);
    return item.price + (extraViews * VIEW_STEP_PRICE);
  }

  return item.price;
}

export function calculateTotals(selectedServices: string[], viewCounts: Record<string, number>) {
  const allItems = [...pricingData.client, ...pricingData.server, ...pricingData.extra];
  const total = selectedServices.reduce((sum, name) => {
    const item = allItems.find(service => service.name === name);
    return sum + (item ? getServicePrice(item, selectedServices, viewCounts) : 0);
  }, 0);

  return {
    total,
    deposit: total * 0.5
  };
}

export function formatServiceName(name: string): string {
  if (name === "UI设计") return "UI 设计";
  if (name === "Android") return "Android 开发";
  if (name === "iOS") return "iOS 开发";
  if (name === "Web") return "Web 开发";
  if (name === "API") return "API 接口";
  if (name === "Admin") return "管理后台";
  if (name === "上架") return "应用上架";
  return name;
}

export function toggleServiceSelection(current: string[], name: string): string[] {
  if (current.includes(name)) {
    return current.filter(service => service !== name);
  }

  return [...current, name];
}
