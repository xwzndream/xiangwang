import { ArrowRight } from "@phosphor-icons/react";
import { corePackages, formatPrice } from "../data/pricing";
import SectionHeading from "./SectionHeading";
interface PricingProps { onOpenModal: () => void }
export default function Pricing({ onOpenModal }: PricingProps) { return <section className="editorial-section" id="services"><SectionHeading number="02" title="服务方案与定价" eyebrow="PACKAGES"/><div className="package-grid">{corePackages.map((item,index)=><article key={item.name}><span className="package-index">0{index+1}</span><h3>{item.name}</h3><p>{item.description}</p><strong>{formatPrice(item)}</strong><button onClick={onOpenModal} aria-label={`咨询${item.name}`}><ArrowRight weight="bold"/></button></article>)}</div></section> }
