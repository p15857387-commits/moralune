import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog-source";
import { isLocale } from "@/lib/i18n";
import { displayName, formatPrice, localize, sortCategories } from "@/lib/catalog";
import { roomLooks } from "@/data/looks";
import { ProductStrip } from "@/components/product-strip";
import { RoomLookShowcase, type RoomLook } from "@/components/room-look-showcase";

const categoryImages: Record<string, string> = {
  "art-rugs": "/images/products/indigo-tide-rug.jpg",
  "cushions-throws": "/images/products/cloudline-wool-throw.jpg",
  "wall-art": "/images/products/tide-woven-wall-art.jpg",
  "artful-storage": "/images/products/reed-nest-basket.jpg",
  "decorative-lighting": "/images/products/travertine-column-lamp.jpg",
};

const categoryCta: Record<string, { en: string; "zh-CN": string }> = {
  "art-rugs": { en: "Shop rugs", "zh-CN": "选块毯" },
  "cushions-throws": { en: "Shop cushions & throws", "zh-CN": "选抱枕与披肩" },
  "wall-art": { en: "Shop wall", "zh-CN": "选墙面" },
  "artful-storage": { en: "Shop objects", "zh-CN": "选器物" },
  "decorative-lighting": { en: "Shop lighting", "zh-CN": "选灯具" },
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const zh = locale === "zh-CN";
  const { categories, products } = await getCatalog();
  const ordered = sortCategories(categories);
  const looks: RoomLook[] = roomLooks.map((look) => ({
    id: look.id,
    poster: look.poster,
    videoSrc: look.videoSrc,
    title: localize(look.title, locale),
    note: localize(look.note, locale),
    alt: localize(look.alt, locale),
    products: look.productIds.flatMap((id) => {
      const product = products.find((item) => item.id === id);
      if (!product?.image) return [];
      return [{
        id: product.id,
        slug: product.slug,
        name: displayName(product.name, locale),
        priceLabel: formatPrice(product.price, locale),
        image: product.image,
        available: product.available,
      }];
    }),
  }));

  return (
    <div className={zh ? "home home-zh" : "home home-en"}>
      <section className="home-campaigns" id="top" aria-label={zh ? "系列" : "Campaign"}>
        <article className="home-frame is-lead is-ledge">
          <Image className="home-frame-image" src="/images/muyu-hero.png" alt={zh ? "日光下的木托盘、陶瓶与编织篮" : "A wooden tray, ceramic vase, and woven basket in daylight"} fill priority sizes="100vw" />
          <span className="home-frame-index">01</span>
          <div className="home-frame-copy">
            <p className="eyebrow">MORALUNE</p>
            <h1>{zh ? "为日常，选一点刚刚好的美。" : "A quieter way to furnish."}</h1>
            <p>{zh ? "块毯、织物、墙面、器物与灯。" : "Rugs, textiles, wall, objects, and light."}</p>
            <div className="home-frame-actions">
              <Link className="button dark" href={`/${locale}/shop`}>{zh ? "探索" : "Explore"}<ArrowRight size={16} /></Link>
              <Link className="text-link" href={`/${locale}/about`}>{zh ? "关于" : "About"}</Link>
            </div>
          </div>
        </article>
        <article className="home-frame is-room">
          <Image className="home-frame-image" src="/images/moralune-room-edit.jpg" alt={zh ? "有大片自然光的起居空间" : "A light-filled living room with a pale rug and sofa"} fill sizes="100vw" />
          <span className="home-frame-index">02</span>
          <div className="home-frame-copy">
            <p className="eyebrow">{zh ? "起居" : "Living"}</p>
            <h2>{zh ? "把房间慢慢配齐。" : "Layer the room."}</h2>
            <p>{zh ? "地面、织物与光。" : "Floor, cloth, and light in one edit."}</p>
            <Link className="button dark" href="#shop-the-room">{zh ? "选这一间" : "Shop the room"}<ArrowRight size={16} /></Link>
          </div>
        </article>
        <article className="home-frame is-floor">
          <Image className="home-frame-image" src="/images/products/indigo-tide-rug.jpg" alt={zh ? "日光房间里的靛蓝曲线羊毛地毯" : "An indigo line across a wool rug in a sunlit room"} fill sizes="100vw" />
          <span className="home-frame-index">03</span>
          <div className="home-frame-copy">
            <p className="eyebrow">{zh ? "块毯" : "Rugs"}</p>
            <h2>{zh ? "从地面开始。" : "The floor, first."}</h2>
            <p>{zh ? "羊毛，轻轻铺开。" : "Wool, laid down softly."}</p>
            <Link className="button dark" href={`/${locale}/shop?category=art-rugs`}>{zh ? "选块毯" : "Shop rugs"}<ArrowRight size={16} /></Link>
          </div>
        </article>
      </section>

      <p className="home-promise home-wrap">{zh ? "独立品牌 · 诚实材质 · 为日常而选" : "Independent makers · Honest materials · Made for daily use"}</p>

      <section className="home-departments" id="categories">
        <div className="home-section-head home-wrap">
          <p className="eyebrow">{zh ? "品类" : "Categories"}</p>
          <h2>{zh ? "按品类选。" : "Shop by piece."}</h2>
        </div>
        <div className="category-entries">
          {ordered.map((category, index) => (
            <Link key={category.id} href={`/${locale}/shop?category=${category.slug}`} className={`category-entry category-entry-${index + 1}`}>
              <Image src={categoryImages[category.slug] ?? categoryImages["art-rugs"]} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" />
              <span className="category-entry-copy">
                <small>0{index + 1}</small>
                <strong>{localize(category.name, locale)}</strong>
                <em>{localize(category.description, locale)}</em>
                <span className="category-entry-cta">{categoryCta[category.slug]?.[locale] ?? (zh ? "选物" : "Shop")}<ArrowRight size={15} /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-story home-wrap" id="story">
        <div className="home-story-media">
          <Image src="/images/products/quiet-horizon-print.jpg" alt={zh ? "墙上一幅淡色地平线" : "A pale horizon hanging above a wooden bench"} fill sizes="(max-width: 800px) 100vw, 55vw" />
        </div>
        <div className="home-story-copy">
          <p className="eyebrow">{zh ? "材质" : "Material"}</p>
          <h2>{zh ? "为日常而留。" : "Chosen for daily use."}</h2>
          <p>{zh ? "羊毛、亚麻、陶土与木。放在家里仍然好用，才会留在这里。" : "Wool, linen, clay, and wood. They stay when they still feel right at home."}</p>
          <Link className="text-link" href={`/${locale}/about`}>{zh ? "我们如何挑选" : "How we choose"}<ArrowRight size={16} /></Link>
        </div>
      </section>

      <RoomLookShowcase
        looks={looks}
        locale={locale}
        eyebrow={zh ? "选一间" : "Shop the room"}
        title={zh ? "试一试这间。" : "Try the room."}
        lede={zh ? "把房间拖到中间，右侧是这一间里的器物。" : "Drag a room to the center. The pieces follow."}
        panelLabel={zh ? "这一间" : "In this room"}
        addLabel={zh ? "加入" : "Add"}
        viewLabel={zh ? "查看" : "View"}
        emptyLabel={zh ? "这一间的器物还在整理。" : "Pieces for this room are on their way."}
      />

      <section className="home-edit" id="edit">
        <div className="home-edit-head home-wrap">
          <div>
            <p className="eyebrow">{zh ? "本期精选" : "The edit"}</p>
            <h2>{zh ? "再看一眼。" : "A closer look."}</h2>
          </div>
          <Link className="text-link" href={`/${locale}/shop`}>{zh ? "查看全部" : "View all"}<ArrowRight size={16} /></Link>
        </div>
        <div className="home-wrap">
          <ProductStrip products={products.filter((product) => product.featured)} locale={locale} previousLabel={zh ? "上一组" : "Previous"} nextLabel={zh ? "下一组" : "Next"} />
        </div>
      </section>

      <section className="home-close">
        <p className="eyebrow">MORALUNE</p>
        <h2>{zh ? "从一件开始。" : "Begin with one piece."}</h2>
        <Link className="button dark" href={`/${locale}/shop`}>{zh ? "探索" : "Explore"}<ArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
