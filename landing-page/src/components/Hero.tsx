interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-3xl">
        全栈开发 / 项目外包 / 快速交付
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-2xl">
        帮你把想法做成产品（Web / App / 后端系统）
      </p>
      <p className="text-base text-gray-500 mb-8">
        报价透明 | 支持分阶段开发 | 可长期维护
      </p>
      <button
        onClick={onOpenModal}
        className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
      >
        👉 立即获取方案与报价
      </button>
      <p className="mt-6 text-gray-400 text-sm">
        👇 30秒获取项目报价
      </p>
    </section>
  );
}
