import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog-source";
import { isLocale, t } from "@/lib/i18n";
import { localize } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import { PointerParallax } from "@/components/pointer-parallax";
import { notFound } from "next/navigation";

const categoryImages = [
  "/images/products/indigo-tide-rug.jpg",
  "/images/products/cloudline-wool-throw.jpg",
  "/images/products/tide-woven-wall-art.jpg",
  "/images/products/travertine-column-lamp.jpg",
  "/images/products/reed-nest-basket.jpg",
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const zh = locale === "zh-CN";
  const copy = t(locale);
  const { categories, products } = await getCatalog();
  return (
    <>
      <PointerParallax as="section" className="ml-hero home-hero" id="top">
        <div className="ml-hero-copy">
          <p className="ml-kicker"><span /> {zh ? "MORALUNE · 日常生活选物" : "MORALUNE · OBJECTS FOR LIVING"}</p>
          <h1>{zh ? <>为日常，<br />选一点<br /><i>刚刚好的美。</i></> : <>A little beauty,<br />chosen for<br /><i>everyday living.</i></>}</h1>
          <p className="ml-lede">{zh ? "我们相信，家的感觉常常来自一件小小的物件。MORALUNE 汇集来自不同创作者与品牌的家居好物，让日常更舒服，也更像自己。" : "The feeling of home often begins with one small thing. We bring together considered objects from independent makers and design brands, for a life that feels more like your own."}</p>
          <div className="ml-actions"><Link className="ml-button" href={`/${locale}/shop`}>{zh ? "浏览本期选物" : "Explore the collection"}<ArrowRight size={16} /></Link><Link className="ml-text-link" href={`/${locale}/about`}>{zh ? "认识 MORALUNE" : "Our point of view"}</Link></div>
          <div className="ml-hero-note"><span className="ml-note-mark">M</span><span>{zh ? "多元品牌 · 认真挑选 · 为生活留白" : "Independent brands · Thoughtfully chosen · Room to live"}</span></div>
        </div>
        <div className="ml-hero-art"><Image src="/images/muyu-hero.png" alt={zh ? "自然光下的木质托盘、陶器与编织收纳篮" : "A wooden tray, ceramic vase and woven basket in soft daylight"} fill priority sizes="(max-width: 800px) 100vw, 56vw" /><div className="ml-art-caption"><span>OBJECTS FOR EVERYDAY LIFE</span><span>{zh ? "熟悉之物，慢慢成为生活的一部分。" : "Objects that become familiar, in time."}</span></div><div className="ml-orbit" aria-hidden="true" /></div>
        <a className="ml-scroll" href="#campaign-02"><span>{zh ? "继续探索" : "SCROLL TO DISCOVER"}<ArrowDown size={13}/></span></a>
      </PointerParallax>

      <PointerParallax as="section" className="ml-campaign-band campaign-material" id="campaign-02" ariaLabel={zh ? "材质专题" : "Material study"}>
        <Image src="/images/products/arc-ceramic-wall-relief.jpg" alt={zh ? "暖光下的陶土墙面浮雕与细腻肌理" : "A sculptural clay wall relief in warm afternoon light"} fill sizes="100vw" />
        <div className="ml-campaign-copy"><p className="ml-kicker">MORALUNE / MATERIAL STUDY 01</p><h2>{zh ? <>触感里的<br /><i>日常风景。</i></> : <>A quiet study<br /><i>in texture.</i></>}</h2><p>{zh ? "石、木、织物——从触感开始，重新发现熟悉之物。" : "Stone, wood, linen — objects chosen as much for how they feel as how they look."}</p><Link href={`/${locale}/shop`}>{zh ? "探索材质选物" : "EXPLORE THE EDIT"}<ArrowRight size={16}/></Link></div>
        <span className="ml-campaign-index">02 — 04</span>
      </PointerParallax>

      <PointerParallax as="section" className="ml-campaign-band campaign-table" ariaLabel={zh ? "餐桌主题" : "The table edit"}>
        <Image src="/images/moralune-table-edit.jpg" alt={zh ? "由器皿和自然光构成的餐桌一景" : "A dining table set with considered everyday objects"} fill sizes="100vw" />
        <div className="ml-campaign-copy"><p className="ml-kicker">THE TABLE / MORALUNE EDIT 02</p><h2>{zh ? <>把日常一餐，<br /><i>过成喜欢的样子。</i></> : <>Gather around<br /><i>the everyday.</i></>}</h2><p>{zh ? "为一日三餐，挑选值得反复使用的器物。" : "Thoughtful pieces for meals, conversations and all the little rituals around them."}</p><Link href={`/${locale}/shop`}>{zh ? "发现餐桌好物" : "SHOP THE COLLECTION"}<ArrowRight size={16}/></Link></div>
        <span className="ml-campaign-index">03 — 04</span>
      </PointerParallax>

      <PointerParallax as="section" className="ml-campaign-band campaign-space" ariaLabel={zh ? "空间灵感" : "Space and living"}>
        <Image src="/images/moralune-room-edit.jpg" alt={zh ? "自然光与器物构成的居家空间" : "A light-filled home layered with natural materials"} fill sizes="100vw" />
        <div className="ml-campaign-copy"><p className="ml-kicker">ROOM TO BREATHE / 03</p><h2>{zh ? <>留一点空间，<br /><i>给真正喜欢的东西。</i></> : <>Make room for<br /><i>what you love.</i></>}</h2><p>{zh ? "让家具、器物与光线，慢慢构成自己的家。" : "A slower rhythm, shaped by the objects and details you choose to keep close."}</p><Link href={`/${locale}/about`}>{zh ? "探索空间灵感" : "DISCOVER THE STORY"}<ArrowRight size={16}/></Link></div>
        <span className="ml-campaign-index">04 — 04</span>
      </PointerParallax>

      <section className="ml-trust"><div><span>01</span><strong>{zh ? "多元设计品牌" : "A MIX OF INDEPENDENT BRANDS"}</strong><small>{zh ? "发现来自不同创作者的好物" : "Discover pieces from distinctive makers"}</small></div><div><span>02</span><strong>{zh ? "为日常认真挑选" : "THOUGHTFULLY SELECTED"}</strong><small>{zh ? "美感、材质与实用并重" : "Beauty, material and use in balance"}</small></div><div><span>03</span><strong>{zh ? "小物，也有长久的陪伴" : "MADE TO LIVE WITH"}</strong><small>{zh ? "从喜欢，到融入生活" : "From a first glance to everyday life"}</small></div></section>

      <section className="ml-ritual home-categories" id="categories"><div className="ml-section-head"><p className="ml-kicker">01 · {copy.categories}</p><h2>{zh ? <>从一件小物开始，<br /><i>慢慢成为喜欢的家。</i></> : <>Small objects.<br /><i>A home that feels like yours.</i></>}</h2><p>{zh ? "家居选物不止一种风格。按日常场景慢慢浏览，找到那些让你愿意每天使用的东西。" : "There is no single way to make a home. Browse by everyday ritual and find the things you will want to live with."}</p></div>
        <div className="ml-category-grid">{categories.map((category,index)=><Link key={category.id} href={`/${locale}/shop?category=${category.slug}`} className={`ml-category-card card-${index+1}`}><Image src={categoryImages[index % categoryImages.length]} alt="" fill sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 20vw"/><span>0{index+1} / MORALUNE EDIT</span><div><h3>{localize(category.name,locale)}</h3><p>{localize(category.description,locale)}</p></div><ArrowUpRight size={18}/></Link>)}</div>
      </section>

      <section className="ml-featured" id="edit"><div className="ml-featured-head"><div><p className="ml-kicker">02 · MORALUNE EDIT / 01</p><h2>{zh ? "本期，值得细看。" : "A closer look at this edit."}</h2></div><Link href={`/${locale}/shop`}>{zh ? "浏览全部选物" : "View all objects"}<ArrowRight size={16}/></Link></div><ProductGrid products={products.filter(product=>product.featured)} locale={locale}/></section>

      <section className="ml-manifesto" id="philosophy"><div className="ml-manifesto-image"><Image src="/images/products/light-between-hills-diptych.jpg" alt={zh ? "以材质、光线与日常器物构成的温暖居家一角" : "A warm living space shaped by light, material and everyday objects"} fill sizes="(max-width: 800px) 100vw, 50vw"/><span>{zh ? "让喜欢的东西，成为日常。" : "LET WHAT YOU LOVE BECOME EVERYDAY."}</span></div><div className="ml-manifesto-copy"><p className="ml-kicker">03 · {zh?"我们的选择":"OUR POINT OF VIEW"}</p><h2>{zh?<>少一点堆砌。<br /><i>多一点心意。</i></>:<>Less, but more<br /><i>meaningful.</i></>}</h2><p>{zh ? "我们不追逐短暂的新鲜感，也不把家变成展示间。我们在不同品牌与创作者之间寻找好设计、好材质和恰到好处的细节，让每一件物品都能自然进入生活。" : "We are not here to fill a room. We look across independent makers and design brands for thoughtful form, honest materials and useful details—objects that find their place in daily life."}</p><Link href={`/${locale}/about`}>{zh?"了解 MORALUNE 的选物观":"How we choose"}<ArrowRight size={16}/></Link></div></section>

      <section className="ml-principles"><div className="ml-principle-title"><p className="ml-kicker">04 · THE MORALUNE EDIT</p><h2>{zh?"为生活而选。":"Chosen for living."}</h2></div><div className="ml-principle-list"><div><span>01</span><h3>{zh?"设计感，不止于外表":"Design that goes beyond the surface"}</h3><p>{zh?"轮廓、触感与使用方式，一起构成物件的美。":"Form, touch and use belong in the same conversation."}</p></div><div><span>02</span><h3>{zh?"在多元里，找到自己的节奏":"Many voices, one thoughtful rhythm"}</h3><p>{zh?"汇集不同创作者与品牌，让选择保持开放而有方向。":"A considered mix of makers, perspectives and disciplines."}</p></div><div><span>03</span><h3>{zh?"让好物回到日常":"Objects to be used and lived with"}</h3><p>{zh?"喜欢的东西值得被使用，而不只是被收藏。":"The things you love deserve a place in everyday life."}</p></div></div></section>

      <section className="ml-last"><p className="ml-kicker">MORALUNE · OBJECTS FOR LIVING</p><h2>{zh?<>熟悉之物，<br /><i>构成家的感觉。</i></>:<>Find the things<br /><i>that feel like home.</i></>}</h2><Link href={`/${locale}/shop`}>{zh?"发现本期选物":"Discover the collection"}<ArrowRight size={16}/></Link></section>
    </>
  );
}
