export default function Services() {
  const services = [
    { title: "客户端开发", items: ["Android", "iOS", "Web"] },
    { title: "服务端开发", items: ["API 接口", "后台管理系统"] },
    { title: "上线支持", items: ["应用上架", "服务器部署"] },
    { title: "运维维护", items: ["Bug 修复", "版本更新"] }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
          可提供服务
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{service.title}</h3>
              <ul className="space-y-2">
                {service.items.map((item, j) => (
                  <li key={j} className="text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
