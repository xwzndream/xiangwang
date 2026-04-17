export default function Rules() {
  const rules = [
    "预付 50% 定金，完成后付尾款",
    "每个功能支持 1-2 次修改",
    "超出需求范围按新增收费",
    "提供 7 天基础售后支持"
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          合作说明
        </h2>
        <div className="bg-gray-50 rounded-xl p-8">
          <ul className="space-y-4">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
                <span className="text-gray-700">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
