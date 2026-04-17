export const pricingData = {
  client: [
    { name: "UI设计", price: 10000, type: "view", base: 50 },
    { name: "前端开发", price: 10000, type: "view", base: 50 }
  ],
  server: [
    { name: "API", price: 10000 },
    { name: "Admin", price: 10000 }
  ],
  extra: [
    { name: "已有UI", price: 0, note: "仅收开发费，无需UI设计" },
    { name: "上架", price: 5000, note: "仅服务费，不含账号与材料费，不保证上架" }
  ]
};

export const contact = {
  phone: "17521217112",
  wechat: "17521217112"
};

export function calculatePrice(name: string, basePrice: number, baseViews: number, extraViews: number = 0): number {
  if (extraViews > 0) {
    return basePrice + (extraViews * 200);
  }
  return basePrice;
}