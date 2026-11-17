import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { HomeSceneDeck } from "@/components/home-scene-deck";
import { homeScenes, sceneStyle } from "@/data/home-scenes";
import { getCatalog } from "@/lib/catalog-source";
import { localize, sortCategories } from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";
import { marks } from "@/lib/brand";
import type { Locale } from "@/types";

const categoryNotes: Record<string, Record<Locale, string>> = {
  rugs: { en: "Wool underfoot", "zh-CN": "羊毛在脚下" },
  cushions: { en: "For the seat and the bed", "zh-CN": "坐与卧" },
  "wall-hangings": { en: "For a quiet wall", "zh-CN": "给墙面" },
  objects: { en: "For the table and shelf", "zh-CN": "桌面与层架" },
  lamps: { en: "For the evening", "zh-CN": "给夜晚" },
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
    <HomeSceneDeck>
      <section className="scene-hero" id="top" data-scene aria-label={zh ? "首页" : "Home"} style={sceneStyle(homeScenes.hero)}>
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
              ? "块毯、抱枕、墙面挂饰、小摆件与灯。"
              : "Rugs, cushions, wall hangings, objects, and lamps."}
          </p>
          <div className="house-hero-actions">
            <Link className="button dark" href={shopHref}>{zh ? "进入系列" : "Explore the collection"}<ArrowRight size={16} /></Link>
            <Link className="text-link" href={`/${locale}/about`}>{zh ? "关于" : "About"}</Link>
          </div>
        </div>
      </section>

      <section className="scene-band scene-band-hush" data-scene style={sceneStyle(homeScenes.atmosphere)}>
        <div className="scene-frame">
          <Image src={homeScenes.atmosphere.src} alt={homeScenes.atmosphere.alt[locale]} fill sizes="100vw" />
        </div>
        <p className="scene-slogan">{zh ? "一种更安静的在场。" : "A quieter kind of presence."}</p>
      </section>

      <section className="scene-band scene-band-niche" data-scene style={sceneStyle(homeScenes.niche)}>
        <div className="scene-frame">
          <Image src={homeScenes.niche.src} alt={homeScenes.niche.alt[locale]} fill sizes="100vw" />
        </div>
        <p className="scene-slogan">{zh ? "给慢下来留出空间。" : "Room to slow down."}</p>
      </section>
    </HomeSceneDeck>

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
