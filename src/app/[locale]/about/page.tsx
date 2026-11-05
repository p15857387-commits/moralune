import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const zh = locale === "zh-CN";
  return <div className="about-page"><section className="about-hero page-shell"><div><p className="eyebrow">{zh ? "关于 MORALUNE" : "ABOUT MORALUNE"}</p><h1>{zh ? "家不是一次完成的作品，\n而是日常留下的痕迹。" : "A home is never finished.\nIt is shaped by everyday traces."}</h1></div><p>{zh ? "MORALUNE 是一家家居买手店。我们在多元品牌与创作者之间，寻找有设计感、也愿意被日常使用的物件。好的选择不必喧哗，只要让生活多一点舒服与心意。" : "MORALUNE is a homeware concept store bringing together independent makers and design-led brands. We look for thoughtful objects made to be used and lived with—quiet choices that make everyday life feel a little more considered."}</p></section><div className="about-image"><Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=90" alt="Natural, quiet home interior" fill sizes="100vw" /></div><section className="values page-shell"><p className="eyebrow">{zh ? "我们的选物观" : "OUR POINT OF VIEW"}</p><div className="values-grid">{[
    [zh ? "多元而有方向" : "A thoughtful mix", zh ? "汇集不同品牌与创作者，让风格保持开放，也保有审美脉络。" : "Independent makers and design brands, brought together with a clear point of view."],
    [zh ? "好看，也好用" : "Form meets function", zh ? "轮廓、材质与使用体验并重，让设计自然进入生活。" : "Considered form and material, made to find a place in everyday life."],
    [zh ? "日常，值得认真对待" : "Made for everyday", zh ? "不追逐短暂的新鲜感，选择能被长期使用和喜爱的物件。" : "Beyond passing trends, we choose objects worth keeping close."],
  ].map(([title, body], i) => <div key={title}><span>0{i + 1}</span><h2>{title}</h2><p>{body}</p></div>)}</div></section></div>;
}
