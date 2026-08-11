import { ArrowRight } from "@phosphor-icons/react";
import SectionHeading from "./SectionHeading";
const imageModules=import.meta.glob("../assets/image/*.{png,jpg,jpeg,webp,avif}",{eager:true,query:"?url",import:"default"}) as Record<string,string>;
const works=Object.entries(imageModules).map(([path,src])=>({src,title:decodeURIComponent(path.split("/").pop()?.replace(/\.[^.]+$/g,"")??"项目作品")})).sort((a,b)=>a.title.localeCompare(b.title,"zh-CN"));
const descriptions:Record<string,string>={"星绘工具箱":"基于 ComfyUI 与大模型的 AI 内容生成工具，支持图像、视频、音频及多类创作流程。","路口拥堵识别系统":"面向城市路口的自动识别与状态监控系统，支持多路数据汇总与运行分析。","道路标识系统":"道路标识识别与统计工具，支持视频检测、模型切换、类型统计与记录管理。"};
export default function Portfolio(){if(!works.length)return null;return <section className="editorial-section" id="works"><SectionHeading number="04" title="作品案例" eyebrow="SERIES STUDIES"/><div className="portfolio-grid">{works.map(work=><a key={work.src} href={work.src} target="_blank" rel="noreferrer"><div className="work-image"><img src={work.src} alt={work.title} loading="lazy"/></div><h3>{work.title}</h3><p>{descriptions[work.title]??"独立完成的功能型软件项目。"}</p><span>查看作品 <ArrowRight weight="bold"/></span></a>)}</div></section>}
