import type { LocalizedText } from "@/types";

const text = (zh: string, en: string): LocalizedText => ({ "zh-CN": zh, en });

export type LookDefinition = {
  id: string;
  poster: string;
  /** Optional muted looping video. The poster still shows until a file is added. */
  videoSrc?: string;
  title: LocalizedText;
  note: LocalizedText;
  alt: LocalizedText;
  productIds: string[];
};

export const roomLooks: LookDefinition[] = [
  {
    id: "morning-ledge",
    poster: "/images/muyu-hero.png",
    title: text("晨光台面", "Morning ledge"),
    note: text("胡桃木托盘、编织篮，再配一件小陶。", "A walnut tray, a woven basket, and a small clay piece."),
    alt: text("日光下的木托盘、陶瓶与编织篮", "A wooden tray, ceramic vase, and woven basket in daylight"),
    productIds: ["walnut-landing-tray", "reed-nest-basket", "clay-pocket-organizer"],
  },
  {
    id: "indigo-room",
    poster: "/images/products/indigo-tide-rug.jpg",
    title: text("靛蓝起居", "Indigo room"),
    note: text("脚下是羊毛地毯，手边一条披毯与抱枕。", "Wool underfoot, with a throw and cushion close by."),
    alt: text("日光房间里的靛蓝曲线羊毛地毯", "An indigo line across a wool rug in a sunlit room"),
    productIds: ["indigo-tide-rug", "cloudline-throw", "moss-loop-cushion"],
  },
  {
    id: "bedside",
    poster: "/images/products/moonstone-table-lamp.jpg",
    title: text("床侧", "Bedside"),
    note: text("一盏瓷灯，旁边是亚麻。", "A porcelain lamp, and linen beside the bed."),
    alt: text("床头木柜上亮着的月白陶瓷台灯", "A glowing porcelain table lamp on a wooden bedside"),
    productIds: ["moonstone-table-lamp", "ink-line-cushion"],
  },
  {
    id: "quiet-wall",
    poster: "/images/products/quiet-horizon-print.jpg",
    title: text("安静的墙", "Quiet wall"),
    note: text("一幅地平线，下面一只编织篮。", "A horizon on the wall, and a basket beneath it."),
    alt: text("橡木框里的淡色地平线，下方是木案与编织篮", "A pale horizon in an oak frame above a wooden bench and woven basket"),
    productIds: ["quiet-horizon-print", "reed-nest-basket"],
  },
  {
    id: "dune-sofa",
    poster: "/images/products/dune-chorus-rug.jpg",
    title: text("沙丘沙发", "Dune sofa"),
    note: text("暖色羊毛地毯，沙发上一条披毯。", "Warm wool on the floor, and a throw for the sofa."),
    alt: text("暖色波浪羊毛地毯铺在沙发旁的木地板上", "A warm wave-patterned wool rug beside a sofa"),
    productIds: ["dune-chorus-rug", "amber-herringbone-throw", "terra-grid-cushion"],
  },
];
