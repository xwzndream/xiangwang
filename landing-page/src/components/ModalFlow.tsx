import { useState, useEffect } from "react";
import { pricingData, contact } from "../data/pricing";

interface ModalFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelected?: string[];
}

export default function ModalFlow({ isOpen, onClose, initialSelected = [] }: ModalFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>(initialSelected);
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedServices(initialSelected);
      setContactInfo("");
      setMessage("");
      setIsSuccess(false);
    }
  }, [isOpen, initialSelected]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const total = selectedServices.reduce((sum, name) => {
    const allItems = [...pricingData.client, ...pricingData.server, ...pricingData.extra];
    const item = allItems.find(i => i.name === name);
    return sum + (item?.price || 0);
  }, 0);

  const deposit = total * 0.5;

  const toggleService = (name: string) => {
    setSelectedServices(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handleSubmit = async () => {
    if (!contactInfo.trim()) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/.netlify/functions/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: contactInfo,
          services: selectedServices,
          total,
          deposit,
          message,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("提交失败，请稍后重试");
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (isSuccess) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">提交成功！</h3>
          <p className="text-gray-600 mb-6">我会尽快联系你，请保持通讯畅通</p>
          <p className="text-gray-500">也可以直接加我微信：{contact.wechat}</p>
          <button
            onClick={onClose}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            关闭
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">选择服务类型</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSelectedServices(pricingData.client.map(i => i.name)); setStep(2); }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left"
              >
                <div className="text-lg font-semibold text-gray-900">App开发</div>
                <div className="text-sm text-gray-500">Android / iOS / Web</div>
              </button>
              <button
                onClick={() => { setSelectedServices(pricingData.server.map(i => i.name)); setStep(2); }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left"
              >
                <div className="text-lg font-semibold text-gray-900">后端系统</div>
                <div className="text-sm text-gray-500">API / 管理后台</div>
              </button>
              <button
                onClick={() => { setSelectedServices([...pricingData.client.map(i => i.name), ...pricingData.server.map(i => i.name)]); setStep(2); }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left"
              >
                <div className="text-lg font-semibold text-gray-900">全栈开发</div>
                <div className="text-sm text-gray-500">前后端全套</div>
              </button>
              <button
                onClick={() => setStep(2)}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left"
              >
                <div className="text-lg font-semibold text-gray-900">先聊聊</div>
                <div className="text-sm text-gray-500">不确定需求</div>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">勾选服务范围</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {[...pricingData.client, ...pricingData.server, ...pricingData.extra].map(item => (
                <label key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(item.name)}
                      onChange={() => toggleService(item.name)}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-800">
                      {item.name === "Deploy" ? "应用上架" : 
                       item.name === "Admin" ? "管理后台" : 
                       item.name === "API" ? "API接口" : `${item.name}开发`}
                    </span>
                  </div>
                  <span className="text-gray-600">¥{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg">
              <div className="flex justify-between">
                <span>合计</span>
                <span className="font-bold">¥{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6">你的报价</h3>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <div className="text-sm text-gray-500 mb-2">已选服务</div>
              <div className="text-gray-700 mb-4">
                {selectedServices.length > 0 ? selectedServices.join(" + ") : "待定"}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">¥{total.toLocaleString()}</div>
              <div className="text-gray-500">预付 ¥{deposit.toLocaleString()}</div>
            </div>
            <p className="text-sm text-gray-500">
              * 具体价格根据需求评估后确定
            </p>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">填写联系方式</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电话或微信 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  placeholder="手机号或微信号"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注（选填）
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="简单描述你的项目需求..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!contactInfo.trim() || isSubmitting}
                className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "提交中..." : "提交咨询"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && !isSuccess && (
              <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-gray-700">
                ← 返回
              </button>
            )}
            <span className="text-sm text-gray-500">
              {!isSuccess && `步骤 ${step} / 4`}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div className="p-6">
          {renderStep()}
        </div>

        {!isSuccess && step < 4 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && selectedServices.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              下一步
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
