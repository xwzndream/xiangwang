import { contact } from "../data/pricing";

interface CTAProps {
  onOpenModal: () => void;
}

export default function CTA({ onOpenModal }: CTAProps) {
  return (
    <section className="py-16 px-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          还不确定？先聊聊你的想法
        </h2>
        <button
          onClick={onOpenModal}
          className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
        >
          👉 立即获取方案与报价
        </button>
        <div className="mt-8 text-gray-400">
          <p>或直接联系：</p>
          <p className="text-lg mt-2">微信/电话：{contact.phone}</p>
        </div>
      </div>
    </section>
  );
}
