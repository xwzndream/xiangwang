import { ArrowRight } from "@phosphor-icons/react";
import SectionHeading from "./SectionHeading";

const imageModules=import.meta.glob("../assets/image/*.{png,jpg,jpeg,webp,avif}",{eager:true,query:"?url",import:"default"}) as Record<string,string>;
const descriptionModules=import.meta.glob("../assets/image/*.txt",{eager:true,query:"?raw",import:"default"}) as Record<string,string>;
const descriptions=Object.fromEntries(Object.entries(descriptionModules).map(([path,description])=>[decodeURIComponent(path.split("/").pop()?.replace(/\.txt$/i,"")??""),description.trim()]));
const works=Object.entries(imageModules).map(([path,src])=>{const title=decodeURIComponent(path.split("/").pop()?.replace(/\.[^.]+$/g,"")??"项目作品");return{src,title,description:descriptions[title]||"独立完成的功能型软件项目。"};}).sort((a,b)=>a.title.localeCompare(b.title,"zh-CN"));

export default function Portfolio(){if(!works.length)return null;return <section className="editorial-section" id="works"><SectionHeading number="04" title="作品案例" eyebrow="SERIES STUDIES"/><div className="portfolio-grid">{works.map(work=><a key={work.src} href={work.src} target="_blank" rel="noreferrer"><div className="work-image"><img src={work.src} alt={work.title} loading="lazy"/></div><h3>{work.title}</h3><p>{work.description}</p><span>查看作品 <ArrowRight weight="bold"/></span></a>)}</div></section>}
