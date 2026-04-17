import { useState } from "react";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import Calculator from "./components/Calculator";
import Process from "./components/Process";
import Rules from "./components/Rules";
import CTA from "./components/CTA";
import FloatingButton from "./components/FloatingButton";
import ModalFlow from "./components/ModalFlow";
import { getDefaultViewCount, toggleServiceSelection } from "./data/pricing";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({
    UI设计: getDefaultViewCount("UI设计"),
    Android: getDefaultViewCount("Android"),
    iOS: getDefaultViewCount("iOS"),
    Web: getDefaultViewCount("Web")
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleService = (name: string) => {
    setSelectedServices(prev => toggleServiceSelection(prev, name));
  };

  const handleViewCountChange = (name: string, count: number) => {
    const normalizedCount = Math.max(1, count);

    setViewCounts(prev => ({
      ...prev,
      [name]: normalizedCount,
      ...(name === "UI设计"
        ? {
            Android: normalizedCount,
            iOS: normalizedCount,
            Web: normalizedCount
          }
        : {})
    }));
  };

  const handleGetQuote = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero onOpenModal={handleOpenModal} />
      <Trust />
      <Services />
      <Pricing onOpenModal={handleOpenModal} />
      <Calculator
        selected={selectedServices}
        onToggle={handleToggleService}
        viewCounts={viewCounts}
        onViewCountChange={handleViewCountChange}
        onGetQuote={handleGetQuote}
      />
      <Process />
      <Rules />
      <CTA onOpenModal={handleOpenModal} />
      <FloatingButton onClick={handleOpenModal} />
      <ModalFlow
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedServices={selectedServices}
        onSetSelectedServices={setSelectedServices}
        onToggleService={handleToggleService}
        viewCounts={viewCounts}
        onViewCountChange={handleViewCountChange}
      />
    </div>
  );
}

export default App;
