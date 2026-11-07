import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { homeScenes, sceneStyle } from "@/data/home-scenes";
import { getCatalog } from "@/lib/catalog-source";
import { localize, sortCategories } from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";
import { marks } from "@/lib/brand";
import type { Locale } from "@/types";

const categoryNotes: Record<string, Record<Locale, string>> = {
  "art-rugs": { en: "Wool underfoot", "zh-CN": "羊毛在脚下" },
  "cushions-throws": { en: "For the seat and the bed", "zh-CN": "坐与卧" },
  "wall-art": { en: "For a quiet wall", "zh-CN": "给墙面" },
  "artful-storage": { en: "For the table and shelf", "zh-CN": "桌面与层架" },
  "decorative-lighting": { en: "For the evening", "zh-CN": "给夜晚" },
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const zh = locale === "zh-CN";
  const { categories } = await getCatalog();
  const ordered = sortCategories(categories);
  const shopHref = `/${locale}/shop`;

  return (
    <div className={zh ? "home home-zh" : "home home-en"}>
      <section className="scene-hero" id="top" aria-label={zh ? "首页" : "Home"} style={sceneStyle(homeScenes.hero)}>
        <div className="scene-frame scene-hero-frame">
          <Image src={homeScenes.hero.src} alt={homeScenes.hero.alt[locale]} fill priority sizes="100vw" />
        </div>
        <div className="scene-hero-copy">
          <p className="eyebrow house-kicker">
            <Image src={marks.moon} alt="" width={16} height={16} />
            <span>{zh ? "为家而设计" : "Design for the home"}</span>
          </p>
          <h1>{zh ? <>安静的光<br />放进已有的房间。</> : <>Quiet light<br />for the rooms you keep.</>}</h1>
          <p className="house-hero-lede">
            {zh
              ? "块毯、抱枕与披肩、墙面、器物与灯。"
              : "Art rugs, cushions and throws, wall, objects, and lamps."}
          </p>
          <div className="house-hero-actions">
            <Link className="button dark" href={shopHref}>{zh ? "进入系列" : "Explore the collection"}<ArrowRight size={16} /></Link>
            <Link className="text-link" href={`/${locale}/about`}>{zh ? "关于" : "About"}</Link>
          </div>
        </div>
      </section>

      <section className="scene-band scene-band-corridor" style={sceneStyle(homeScenes.story)}>
        <div className="scene-frame">
          <Image src={homeScenes.story.src} alt={homeScenes.story.alt[locale]} fill sizes="100vw" />
        </div>
      </section>

      <section className="scene-band scene-band-hush" style={sceneStyle(homeScenes.atmosphere)}>
        <div className="scene-frame">
          <Image src={homeScenes.atmosphere.src} alt={homeScenes.atmosphere.alt[locale]} fill sizes="100vw" />
        </div>
      </section>

      <nav className="home-index" id="categories" aria-label={zh ? "系列" : "The collection"}>
        {ordered.map((category) => (
          <Link key={category.id} href={`${shopHref}?category=${category.slug}`}>
            <strong>{localize(category.name, locale)}</strong>
            <span>{categoryNotes[category.slug]?.[locale] ?? localize(category.description, locale)}</span>
          </Link>
        ))}
      </nav>

      <section className="home-note" id="story">
        <p>{zh ? "羊毛、亚麻、陶土、木，以及收着的光。" : "Wool, linen, clay, wood, and a measured light."}</p>
        <Link className="text-link" href={`/${locale}/about`}>{zh ? "我们如何挑选" : "How we choose"}<ArrowRight size={15} /></Link>
      </section>
    </div>
  );
}
