import { calculateTotals, formatServiceName, getServicePrice, pricingData, VIEW_BASE, VIEW_STEP_PRICE } from "../data/pricing";

interface CalculatorProps {
  selected: string[];
  onToggle: (name: string) => void;
  viewCounts: Record<string, number>;
  onViewCountChange: (name: string, count: number) => void;
  onGetQuote: () => void;
}

export default function Calculator({ selected, onToggle, viewCounts, onViewCountChange, onGetQuote }: CalculatorProps) {
  const { total, deposit } = calculateTotals(selected, viewCounts);
  const firstFrontendService = pricingData.client.find(item => item.name !== "UI设计" && selected.includes(item.name))?.name;

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
                <div key={item.name} className="p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.name)}
                        onChange={() => onToggle(item.name)}
                        className="w-5 h-5"
                      />
                      <div>
                        <span className="text-gray-800">{formatServiceName(item.name)}</span>
                        <p className="text-sm text-gray-500">¥10,000 起 / 1-50 个视图，每增加 1 个视图 +¥{VIEW_STEP_PRICE}</p>
                      </div>
                    </div>
                    <span className="text-gray-600">¥{getServicePrice(item, selected, viewCounts).toLocaleString()}</span>
                  </label>
                  {selected.includes(item.name) && item.type === "view" && (
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
                      <span className="text-sm text-gray-600">视图数量</span>
                      {item.name === "UI设计" || (!selected.includes("UI设计") && item.name === firstFrontendService) ? (
                        <input
                          type="number"
                          min={1}
                          value={viewCounts.UI设计 ?? VIEW_BASE}
                          onChange={e => onViewCountChange("UI设计", Number(e.target.value) || 1)}
                          className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-right outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">跟随 UI 视图数量：{viewCounts.UI设计 ?? VIEW_BASE}</span>
                      )}
                    </div>
                  )}
                </div>
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
                    <span className="text-gray-800">{formatServiceName(item.name)}</span>
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
                    <div>
                      <span className="text-gray-800">{formatServiceName(item.name)}</span>
                      {item.note && <p className="text-sm text-gray-500">{item.note}</p>}
                    </div>
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
            👉 立即获取方案与报价
          </button>
        </div>
      </div>
    </section>
  );
}
