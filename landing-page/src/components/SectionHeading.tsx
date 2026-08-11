interface Props { number: string; title: string; id?: string; eyebrow: string }
export default function SectionHeading({ number, title, id, eyebrow }: Props) { return <div className="section-heading" id={id}><span className="side-label">{eyebrow}</span><span className="section-number">{number}</span><h2>{title}</h2><span className="heading-line" /></div> }
