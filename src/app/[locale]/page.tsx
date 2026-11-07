import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { CategorySelect, type CategoryChoice } from "@/components/category-select";
import { homeScenes, sceneStyle } from "@/data/home-scenes";
import { getCatalog } from "@/lib/catalog-source";
import { displayName, formatListedPrice, isPreviewDraft, localize, sortCategories } from "@/lib/catalog";
import { imageLedHomeEdit } from "@/lib/home-selection";
import { isLocale } from "@/lib/i18n";
import { marks } from "@/lib/brand";
import type { Locale, Product } from "@/types";

const categoryNotes: Record<string, Record<Locale, string>> = {
  "art-rugs": {
    en: "Wool underfoot. The first quiet layer of a room.",
    "zh-CN": "羊毛在脚下。房间的第一层安静。",
  },
  "cushions-throws": {
    en: "Linen and wool, where you sit and where you sleep.",
    "zh-CN": "亚麻与羊毛，放在坐与卧的地方。",
  },
  "wall-art": {
    en: "Hangings with space left around them.",
    "zh-CN": "挂饰四周，留出空白。",
  },
  "artful-storage": {
    en: "Small forms for the table, the entry, the shelf.",
    "zh-CN": "桌面、入口与层架上的小件。",
  },
  "decorative-lighting": {
    en: "Lamps that keep the evening soft.",
    "zh-CN": "让夜晚保持柔和的灯。",
  },
};

const allLabels: Record<string, Record<Locale, string>> = {
  "art-rugs": { en: "All rugs", "zh-CN": "全部块毯" },
  "cushions-throws": { en: "All cushions & throws", "zh-CN": "全部抱枕与披肩" },
  "wall-art": { en: "All wall", "zh-CN": "全部墙面" },
  "artful-storage": { en: "All objects", "zh-CN": "全部器物" },
  "decorative-lighting": { en: "All lighting", "zh-CN": "全部灯具" },
};

function saleLabel(product: Product, locale: Locale): string {
  const price = formatListedPrice(product, locale);
  if (price) return price;
  if (isPreviewDraft(product)) return locale === "zh-CN" ? "暂不出售" : "Not for sale";
  return locale === "zh-CN" ? "暂时缺货" : "Unavailable";
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const zh = locale === "zh-CN";
  const { categories, products } = await getCatalog();
  const ordered = sortCategories(categories);
  const shopHref = `/${locale}/shop`;
  const edits = ordered.flatMap((category, index) => {
    const edit = imageLedHomeEdit(products, category.slug);
    if (!edit.items.length) return [];
    const choices: CategoryChoice[] = edit.items.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: displayName(product.name, locale),
      detail: localize(product.description, locale),
      image: product.image || "",
      saleLabel: saleLabel(product, locale),
    }));
    return [{
      slug: category.slug,
      indexLabel: `0${index + 1}`,
      title: localize(category.name, locale),
      blurb: categoryNotes[category.slug]?.[locale] ?? localize(category.description, locale),
      choices,
      allLabel: allLabels[category.slug]?.[locale] ?? (zh ? "查看全部" : "View all"),
    }];
  });

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
              ? "块毯、抱枕与披肩、墙面挂饰、器物与灯。看材质，看比例，也看一间房间安静下来的方式。"
              : "Art rugs, cushions and throws, wall hangings, objects, and lamps. Chosen for material, proportion, and the hush of a finished room."}
          </p>
          <div className="house-hero-actions">
            <Link className="button dark" href={shopHref}>{zh ? "进入系列" : "Explore the collection"}<ArrowRight size={16} /></Link>
            <Link className="text-link" href={`/${locale}/about`}>{zh ? "关于" : "About"}</Link>
          </div>
        </div>
      </section>

      <section className="scene-story" id="story" style={sceneStyle(homeScenes.story)}>
        <div className="scene-frame scene-story-frame">
          <Image src={homeScenes.story.src} alt={homeScenes.story.alt[locale]} fill sizes="100vw" />
        </div>
        <div className="scene-story-copy">
          <p className="eyebrow">{zh ? "材质" : "Material"}</p>
          <h2>{zh ? "留得下的，是手碰得到的。" : "What stays is what you can touch."}</h2>
          <p>
            {zh
              ? "看得到织纹的羊毛，垂下来的亚麻，边角柔和的陶，浅色的木。放回那间房间仍然合适，才会留在这里。"
              : "Wool you can see. Linen that falls. Clay with a soft edge. Pale wood, left mostly as it is."}
          </p>
          <Link className="text-link" href={`/${locale}/about`}>{zh ? "我们如何挑选" : "How we choose"}<ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="house-departments" id="categories" aria-label={zh ? "系列" : "The collection"}>
        <div className="house-section-head">
          <div>
            <p className="eyebrow">{zh ? "系列" : "The collection"}</p>
            <h2>{zh ? "房间从这里安静下来。" : "Where a room begins."}</h2>
          </div>
          <p>{zh ? "点一件，这一组的大图就换。" : "Choose a piece. The picture above it changes."}</p>
        </div>
        {edits.map((edit) => (
          <CategorySelect
            key={edit.slug}
            locale={locale}
            slug={edit.slug}
            indexLabel={edit.indexLabel}
            title={edit.title}
            blurb={edit.blurb}
            choices={edit.choices}
            listLabel={zh ? `${edit.title}，这一组` : `${edit.title} in this edit`}
            viewLabel={zh ? "查看这件" : "View this piece"}
            allLabel={edit.allLabel}
          />
        ))}
      </section>

      <section className="scene-close">
        <p className="eyebrow">MORALUNE</p>
        <h2>{zh ? "从一块地毯开始，或从一盏灯。" : "Begin with the floor, or with the light."}</h2>
        <Link className="button dark" href={shopHref}>{zh ? "进入系列" : "Explore the collection"}<ArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
