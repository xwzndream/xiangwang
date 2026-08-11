import { ArrowRight, XLogo } from "@phosphor-icons/react";
interface HeaderProps { onOpenModal: () => void }
export default function Header({ onOpenModal }: HeaderProps) {
  return <header className="site-header"><a className="brand" href="#" aria-label="向往软件工作室首页"><span className="brand-mark"><XLogo weight="fill" /></span><span><strong>向往软件工作室</strong><small>XIANGWANG SOFTWARE STUDIO</small></span></a><nav aria-label="主导航"><a href="#works">作品案例</a><a href="#services">服务方案</a><a href="#quote">定价方案</a><a href="#about">关于我们</a></nav><button className="button button-primary header-cta" onClick={onOpenModal}>咨询合作 <ArrowRight weight="bold" /></button></header>;
}
