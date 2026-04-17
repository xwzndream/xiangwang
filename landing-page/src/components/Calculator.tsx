import { pricingData } from "../data/pricing";

interface CalculatorProps {
  selected: string[];
  onToggle: (name: string) => void;
  onGetQuote: () => void;
}

export default function Calculator({ selected, onToggle, onGetQuote }: CalculatorProps) {
  const total = selected.reduce((sum, name) => {
    const allItems = [...pricingData.client, ...pricingData.server, ...pricingData.extra];
    const item = allItems.find(i => i.name === name);
    return sum + (item?.price || 0);
  }, 0);

  const deposit = total * 0.5;

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          快速估算你的项目
        </h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">客户端</h3>
            <div className="space-y-3">
              {pricingData.client.map(item => (
                <label key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.name)}
                      onChange={() => onToggle(item.name)}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-800">{item.name}开发</span>
                  </div>
                  <span className="text-gray-600">¥{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">服务端</h3>
            <div className="space-y-3">
              {pricingData.server.map(item => (
                <label key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.name)}
                      onChange={() => onToggle(item.name)}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-800">后端{item.name}</span>
                  </div>
                  <span className="text-gray-600">¥{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">附加服务</h3>
            <div className="space-y-3">
              {pricingData.extra.map(item => (
                <label key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.name)}
                      onChange={() => onToggle(item.name)}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-800">应用{item.name}</span>
                  </div>
                  <span className="text-gray-600">¥{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">合计</span>
              <span className="text-2xl font-bold">¥{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">预付（50%）</span>
              <span className="text-xl font-semibold">¥{deposit.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onGetQuote}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
          >
            获取完整方案
          </button>
        </div>
      </div>
    </section>
  );
}
