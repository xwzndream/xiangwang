import { ChatCircleDots } from "@phosphor-icons/react";
interface FloatingButtonProps { onClick: () => void }
export default function FloatingButton({ onClick }: FloatingButtonProps) { return <button onClick={onClick} className="floating-consult"><ChatCircleDots weight="fill"/><span>立即咨询</span></button> }
