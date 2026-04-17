export default function Process() {
  const steps = [
    { num: "1", title: "沟通需求", desc: "了解项目背景与目标" },
    { num: "2", title: "功能拆分 & 报价", desc: "明确范围与工期" },
    { num: "3", title: "支付定金", desc: "预付50%开始开发" },
    { num: "4", title: "开发交付", desc: "分阶段完成功能" },
    { num: "5", title: "验收上线", desc: "确认无误付尾款" }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
          合作流程
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {step.num}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
