import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import Calculator from "./components/Calculator";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Rules from "./components/Rules";
import CTA from "./components/CTA";
import FloatingButton from "./components/FloatingButton";
import ModalFlow from "./components/ModalFlow";
import { toggleServiceSelection } from "./data/pricing";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleToggleService = (name: string) => {
    setSelectedServices(current => toggleServiceSelection(current, name));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <Hero onOpenModal={() => setIsModalOpen(true)} />
      <Trust />
      <Pricing onOpenModal={() => setIsModalOpen(true)} />
      <Calculator
        selected={selectedServices}
        onToggle={handleToggleService}
        onGetQuote={() => setIsModalOpen(true)}
      />
      <Portfolio />
      <Services />
      <Process />
      <Rules />
      <CTA onOpenModal={() => setIsModalOpen(true)} />
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <ModalFlow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedServices={selectedServices}
        onToggleService={handleToggleService}
      />
    </div>
  );
}

export default App;
