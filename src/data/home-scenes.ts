import type { CSSProperties } from "react";
import type { Locale } from "@/types";

/**
 * Homepage atmosphere frames from 品牌与视觉.
 * All files are 2400×1600 (3:2).
 *
 * To replace a frame, overwrite the file in `public/images/home/`
 * (keep the filename) or point `src` at the new public path.
 * `crop.wide` is the desktop object-position. `crop.narrow` is the
 * phone object-position, used when the frame is taller than 3:2.
 * Do not point these slots at product SKU photos.
 *
 * The homepage places `hero`, then `atmosphere` (taller), then
 * `story` (shorter), full-bleed and without extra buttons.
 * `material` stays a candidate and is not required by the layout.
 */
export type HomeScene = {
  id: "hero" | "story" | "atmosphere" | "material";
  src: string;
  status: "approved";
  width: 2400;
  height: 1600;
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
    // The lit corridor sits on the left. A tall crop stays with that light
    // rather than the empty right wall.
    crop: { wide: "center center", narrow: "22% center" },
    alt: {
      en: "Daylight along a pale corridor",
      "zh-CN": "日光沿着一条浅色走廊",
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
