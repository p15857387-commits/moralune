import type { ProductImage, WatermarkFlag } from "@/types";
import fileRows from "./product-photos-v1.files.json";
import planRows from "./product-photos-v1-hero-plan.json";

/**
 * Supplier placeholder photos for product master v1.
 * Swap path and the terra-01 exclusion: src/data/PHOTOS.md.
 */

export const productPhotoRoot = "/products/v1";

/**
 * RUG-TERRA-01 frames are not this sand wool rug.
 * main-01.jpg is the kids tree rug. The other files are different YARIS designs
 * (kids sailboat, sea life, floral, round lattice, green geometric).
 * None of them is used as a hero or gallery image.
 */
export const excludedPhotoFiles: Readonly<Record<string, readonly string[]>> = {
  "RUG-TERRA-01-SND-160x230": [
    "main-01.jpg",
    "detail-01.webp",
    "detail-02.webp",
    "detail-03.webp",
    "detail-04.webp",
    "detail-05.webp",
  ],
};

export const photoMismatchSkus = new Set(["RUG-TERRA-01-SND-160x230"]);

export type PhotoFile = {
  sku: string;
  filename: string;
  watermark: WatermarkFlag;
};

export type HeroPlanEntry = {
  sku: string;
  hero: string;
  hero_wm?: WatermarkFlag;
  gallery: string[];
};

const watermarkRank: Record<WatermarkFlag, number> = { no: 0, suspected: 1, yes: 2 };

export function productPhotoSrc(sku: string, filename: string): string {
  return `${productPhotoRoot}/${sku}/${filename}`;
}

function isWatermark(value: string): value is WatermarkFlag {
  return value === "no" || value === "yes" || value === "suspected";
}

function assertWatermark(value: string, context: string): WatermarkFlag {
  if (isWatermark(value)) return value;
  throw new Error(`Unexpected watermark ${value} at ${context}`);
}

export function chooseProductPhotos(sku: string, files: readonly PhotoFile[], plan?: HeroPlanEntry): ProductImage[] {
  const blocked = new Set(excludedPhotoFiles[sku] ?? []);
  const available = files.filter((file) => file.sku === sku && file.filename && !blocked.has(file.filename));
  const byName = new Map(available.map((file) => [file.filename, file]));

  const usable = (filename: string | undefined): PhotoFile | undefined => {
    if (!filename) return undefined;
    const file = byName.get(filename);
    if (!file || file.watermark === "yes") return undefined;
    return file;
  };

  const firstClean = (names: readonly string[]): PhotoFile | undefined => {
    for (const name of names) {
      const file = byName.get(name);
      if (file?.watermark === "no") return file;
    }
    return available.find((file) => file.watermark === "no");
  };

  const preferredNames = plan ? [plan.hero, ...plan.gallery] : [];
  let hero = usable(plan?.hero);
  if (hero?.watermark !== "no") {
    const clean = firstClean(preferredNames);
    if (clean) hero = clean;
  }
  if (!hero && plan) {
    hero = plan.gallery.map((name) => usable(name)).find((file): file is PhotoFile => Boolean(file));
  }
  if (!hero) {
    hero = available.find((file) => file.watermark === "no")
      ?? available.find((file) => file.watermark === "suspected")
      ?? available.find((file) => file.watermark === "yes");
  }
  if (!hero) return [];

  const ordered: PhotoFile[] = [hero];
  const seen = new Set([hero.filename]);
  const push = (file: PhotoFile | undefined) => {
    if (!file || seen.has(file.filename)) return;
    if (file.watermark === "yes" && hero.watermark !== "yes") return;
    ordered.push(file);
    seen.add(file.filename);
  };
  for (const name of plan?.gallery ?? []) push(byName.get(name));
  const rest = available
    .filter((file) => !seen.has(file.filename))
    .sort((a, b) => watermarkRank[a.watermark] - watermarkRank[b.watermark] || a.filename.localeCompare(b.filename));
  for (const file of rest) push(file);

  return ordered.map((file, index) => ({
    src: productPhotoSrc(sku, file.filename),
    filename: file.filename,
    role: index === 0 ? "hero" : "gallery",
    watermark: file.watermark,
  }));
}

function loadFiles(input: unknown): PhotoFile[] {
  if (!Array.isArray(input)) throw new Error("Photo file list must be an array");
  return input.map((row, index) => {
    if (!row || typeof row !== "object") throw new Error(`Photo file ${index} is not an object`);
    const source = row as Record<string, unknown>;
    if (typeof source.sku !== "string" || typeof source.filename !== "string" || typeof source.watermark !== "string") {
      throw new Error(`Photo file ${index} is incomplete`);
    }
    return {
      sku: source.sku,
      filename: source.filename,
      watermark: assertWatermark(source.watermark, `${source.sku}/${source.filename}`),
    };
  });
}

function loadPlans(input: unknown): HeroPlanEntry[] {
  if (!Array.isArray(input)) throw new Error("Hero plan must be an array");
  return input.map((row, index) => {
    if (!row || typeof row !== "object") throw new Error(`Hero plan ${index} is not an object`);
    const source = row as Record<string, unknown>;
    if (typeof source.sku !== "string" || typeof source.hero !== "string" || !Array.isArray(source.gallery)) {
      throw new Error(`Hero plan ${index} is incomplete`);
    }
    const gallery = source.gallery.filter((name): name is string => typeof name === "string");
    const heroWm = typeof source.hero_wm === "string" ? assertWatermark(source.hero_wm, source.sku) : undefined;
    return { sku: source.sku, hero: source.hero, hero_wm: heroWm, gallery };
  });
}

const photos = loadFiles(fileRows);
const plans = new Map(loadPlans(planRows).map((plan) => [plan.sku, plan]));

export const productPhotosBySku: Record<string, ProductImage[]> = {};

for (const sku of new Set(photos.map((file) => file.sku))) {
  const images = chooseProductPhotos(sku, photos, plans.get(sku));
  if (!images.length) {
    if (!photoMismatchSkus.has(sku)) throw new Error(`No usable photo for ${sku}`);
    productPhotosBySku[sku] = [];
    continue;
  }
  const hero = images[0];
  if (!hero) throw new Error(`No hero for ${sku}`);
  if (hero.watermark === "yes" && images.some((image) => image.watermark !== "yes")) {
    throw new Error(`${sku} uses a watermarked hero while a cleaner frame exists`);
  }
  if ((excludedPhotoFiles[sku] ?? []).some((filename) => images.some((image) => image.filename === filename))) {
    throw new Error(`${sku} includes an excluded photo`);
  }
  productPhotosBySku[sku] = images;
}
