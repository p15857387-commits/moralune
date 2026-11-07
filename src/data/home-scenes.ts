import type { CSSProperties } from "react";
import type { Locale } from "@/types";

/**
 * Homepage atmosphere frames from 品牌与视觉.
 * Most files are 2400×1600 (3:2). The curved niche is 1536×1024, also 3:2.
 *
 * To replace a frame, overwrite the file in `public/images/home/`
 * (keep the filename) or point `src` at the new public path.
 * `crop.wide` is the desktop object-position. `crop.narrow` is the
 * phone object-position, used when the frame is taller than 3:2.
 * Do not point these slots at product SKU photos.
 *
 * The homepage places `hero`, then `atmosphere` (taller), then
 * `niche` (shorter; currently the oak and linen room).
 * `story` (corridor), the curved-plaster file, and `material`
 * stay on disk and are not rendered.
 */
export type HomeScene = {
  id: "hero" | "story" | "atmosphere" | "material" | "niche";
  src: string;
  status: "approved";
  width: number;
  height: number;
  crop: { wide: string; narrow: string };
  alt: Record<Locale, string>;
};

const approved = {
  width: 2400,
  height: 1600,
  status: "approved",
} as const;

export const homeScenes: Record<HomeScene["id"], HomeScene> = {
  hero: {
    id: "hero",
    src: "/images/home/hero-moonlight-living.jpg",
    ...approved,
    // Desktop keeps the full width so the left plaster stays free for the headline.
    // A tall phone crop shifts right, toward the linen and the moon of light.
    crop: { wide: "center 46%", narrow: "78% center" },
    alt: {
      en: "Linen in a quiet room, with a moon of light on the wall",
      "zh-CN": "墙上一弯月光，旁边垂着亚麻",
    },
  },
  story: {
    id: "story",
    src: "/images/home/hero-corridor-light.jpg",
    ...approved,
    // Unused on the homepage. Kept so the file can be swapped back in.
    crop: { wide: "center center", narrow: "22% center" },
    alt: {
      en: "Daylight along a pale corridor",
      "zh-CN": "日光沿着一条浅色走廊",
    },
  },
  niche: {
    id: "niche",
    src: "/images/home/option-1-oak-linen-rest.jpg",
    status: "approved",
    width: 1536,
    height: 1024,
    // A short wide band sits above the floor so the daybed, vase,
    // and window stay in frame and the blurred foreground drops out.
    // Phone is the native 3:2, so the whole room shows.
    crop: { wide: "center 38%", narrow: "center center" },
    alt: {
      en: "A linen daybed and oak bench in warm evening light",
      "zh-CN": "暖色黄昏里的亚麻卧榻与橡木",
    },
  },
  atmosphere: {
    id: "atmosphere",
    src: "/images/home/vignette-sculptural-hush.jpg",
    ...approved,
    // A short wide band crops the top and bottom. Sit lower so the
    // bowl and vase stay in frame. A tall phone crop keeps them on the right.
    crop: { wide: "center 70%", narrow: "82% center" },
    alt: {
      en: "A bowl and vase in warm light, with leaf shadow on the wall",
      "zh-CN": "暖光里的一只碗与一只瓶，墙上有叶影",
    },
  },
  material: {
    id: "material",
    src: "/images/home/band-soft-clay-texture.jpg",
    ...approved,
    // Keep the lighter plaster behind the sentence, with the weave still in frame.
    crop: { wide: "center 34%", narrow: "center 42%" },
    alt: {
      en: "Soft plaster meeting a woven textile",
      "zh-CN": "柔和的墙面，接着一块织纹",
    },
  },
};

export function sceneStyle(scene: HomeScene): CSSProperties {
  return {
    "--scene-crop": scene.crop.wide,
    "--scene-crop-narrow": scene.crop.narrow,
  } as CSSProperties;
}
