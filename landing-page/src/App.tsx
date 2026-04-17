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

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleService = (name: string) => {
    setSelectedServices(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
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
        onGetQuote={handleGetQuote}
      />
      <Process />
      <Rules />
      <CTA onOpenModal={handleOpenModal} />
      <FloatingButton onClick={handleOpenModal} />
      <ModalFlow
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialSelected={selectedServices}
      />
    </div>
  );
}

export default App;
