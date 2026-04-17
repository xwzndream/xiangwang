export default function Trust() {
  const items = [
    { title: "独立全栈开发", desc: "沟通成本低，一个人搞定前后端" },
    { title: "报价清晰透明", desc: "不做低价引流，不随意加价" },
    { title: "从0到上线全流程", desc: "设计、开发、部署全程负责" },
    { title: "长期维护支持", desc: "不做一次性项目，持续迭代" }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
          为什么选择我
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
