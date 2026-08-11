import { ArrowRight } from "@phosphor-icons/react";
import { contact } from "../data/pricing";
interface CTAProps{onOpenModal:()=>void}
export default function CTA({onOpenModal}:CTAProps){return <><section className="final-cta"><div><strong>有想法？我们帮你快速落地。</strong><p>现在咨询，获取专属方案与报价。</p></div><button className="button button-light" onClick={onOpenModal}>立即咨询合作 <ArrowRight weight="bold"/></button><small>联系人：向先生　微信 / 电话：{contact.phone}</small></section><footer><span>© 2026 向往软件工作室 · 独立开发者</span><span>功能优先 · AI 与工程化构建产品</span></footer></>}
