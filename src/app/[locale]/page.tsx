import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog-source";
import { isLocale } from "@/lib/i18n";
import { localize, sortCategories } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import { notFound } from "next/navigation";

const categoryImages: Record<string, string> = {
  "art-rugs": "/images/products/indigo-tide-rug.jpg",
  "cushions-throws": "/images/products/cloudline-wool-throw.jpg",
  "wall-art": "/images/products/tide-woven-wall-art.jpg",
  "artful-storage": "/images/products/reed-nest-basket.jpg",
  "decorative-lighting": "/images/products/travertine-column-lamp.jpg",
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const zh = locale === "zh-CN";
  const { categories, products } = await getCatalog();
  const ordered = sortCategories(categories);
  return (
    <>
      <section className="home-intro" id="top">
        <div className="home-intro-copy">
          <p className="eyebrow">{zh ? "MORALUNE · 日常生活选物" : "MORALUNE · Objects for living"}</p>
          <h1>{zh ? <>为日常，<br />选一点<br /><i>刚刚好的美。</i></> : <>A little beauty,<br />chosen for<br /><i>everyday living.</i></>}</h1>
          <p className="home-intro-lede">{zh ? "家的感觉常常来自一件小小的器物。我们汇集块毯、织物、墙面、小器物与灯，让日常更安静，也更像自己。" : "The feeling of home often begins with one small thing. Rugs, textiles, wall pieces, objects, and light — chosen to make a room feel more like yours."}</p>
          <div className="home-intro-actions">
            <Link className="button dark" href={`/${locale}/shop`}>{zh ? "探索" : "Explore"}<ArrowRight size={16} /></Link>
            <Link className="text-link" href={`/${locale}/about`}>{zh ? "关于" : "About"}</Link>
          </div>
        </div>
        <div className="home-intro-scene">
          <Image src="/images/muyu-hero.png" alt={zh ? "自然光下的木质托盘、陶器与编织器物" : "A wooden tray, ceramic vase and woven basket in soft daylight"} fill priority sizes="(max-width: 800px) 100vw, 56vw" />
        </div>
      </section>

      <p className="quiet-promise">{zh ? "独立品牌 · 诚实材质 · 为日常而选" : "Independent makers · Honest materials · Made for daily use"}</p>

      <section className="ml-ritual home-categories" id="categories">
        <div className="ml-section-head">
          <p className="eyebrow">{zh ? "按品类选" : "Shop by category"}</p>
          <h2>{zh ? <>五类器物，<br /><i>慢慢配成一个家。</i></> : <>Five kinds of objects.<br /><i>One quieter home.</i></>}</h2>
        </div>
        <div className="ml-category-grid">
          {ordered.map((category, index) => (
            <Link key={category.id} href={`/${locale}/shop?category=${category.slug}`} className="ml-category-card">
              <Image src={categoryImages[category.slug] ?? categoryImages["art-rugs"]} alt="" fill sizes="(max-width: 760px) 50vw, 20vw" />
              <span>0{index + 1}</span>
              <div>
                <h3>{localize(category.name, locale)}</h3>
                <p>{localize(category.description, locale)}</p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="ml-featured" id="edit">
        <div className="ml-featured-head">
          <div>
            <p className="eyebrow">{zh ? "本期精选" : "The Edit"}</p>
            <h2>{zh ? "这一期，值得多看一眼。" : "Worth a closer look."}</h2>
          </div>
          <Link href={`/${locale}/shop`}>{zh ? "查看全部" : "View all"}<ArrowRight size={16} /></Link>
        </div>
        <ProductGrid products={products.filter((product) => product.featured)} locale={locale} />
      </section>

      <section className="ml-manifesto home-story" id="story">
        <div className="ml-manifesto-image">
          <Image src="/images/moralune-room-edit.jpg" alt={zh ? "自然光与器物构成的居家一角" : "A light-filled room layered with natural materials"} fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="ml-manifesto-copy">
          <p className="eyebrow">{zh ? "材质与空间" : "Material and room"}</p>
          <h2>{zh ? <>少一点堆砌。<br /><i>多一点触感。</i></> : <>Less clutter.<br /><i>More touch.</i></>}</h2>
          <p>{zh ? "我们不把家做成展示间。羊毛、亚麻、陶土与木，只要放在日常里仍然好看、好用，就会留在这里。" : "We are not filling a showroom. Wool, linen, clay, and wood stay when they still feel right in daily use."}</p>
          <Link className="text-link" href={`/${locale}/about`}>{zh ? "我们如何挑选" : "How we choose"}<ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="ml-last">
        <p className="eyebrow">MORALUNE</p>
        <h2>{zh ? <>把喜欢的，<br /><i>放进日常。</i></> : <>Find the things<br /><i>that feel like home.</i></>}</h2>
        <Link className="button dark" href={`/${locale}/shop`}>{zh ? "探索" : "Explore"}<ArrowRight size={16} /></Link>
      </section>
    </>
  );
}
