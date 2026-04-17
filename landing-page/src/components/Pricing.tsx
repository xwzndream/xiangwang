interface PricingProps {
  onOpenModal: () => void;
}

export default function Pricing({ onOpenModal }: PricingProps) {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          项目大概多少钱？
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 mb-2">UI 设计</p>
            <p className="text-2xl font-bold text-gray-900">¥10,000 起</p>
            <p className="mt-2 text-sm text-gray-500">1-50 个视图，每增加 1 个视图 +¥200</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 mb-2">客户端开发</p>
            <p className="text-2xl font-bold text-gray-900">¥10,000 起</p>
            <p className="mt-2 text-sm text-gray-500">Android / iOS / Web 分开算，各自 1-50 个视图起</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 mb-2">应用上架</p>
            <p className="text-2xl font-bold text-gray-900">¥5,000 / 个</p>
            <p className="mt-2 text-sm text-gray-500">仅服务费，不含账号与材料费，敏感性 App 不能保证一定上架</p>
          </div>
        </div>
        <p className="text-gray-500 mb-4">UI 设计与 Android、iOS、Web 开发均支持按视图数量快速估算。</p>
        <button
          onClick={onOpenModal}
          className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
        >
          👉 立即获取方案与报价
        </button>
        <p className="mt-4 text-sm text-gray-400">根据你的需求自动计算</p>
      </div>
    </section>
  );
}
