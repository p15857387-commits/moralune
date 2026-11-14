/** Old category query values from earlier storefront slugs. */
export const categoryRedirects: Record<string, string> = {
  "art-rugs": "rugs",
  "cushions-throws": "cushions",
  "wall-art": "wall-hangings",
  "artful-storage": "objects",
  "decorative-lighting": "lamps",
  lighting: "lamps",
  wall: "wall-hangings",
};

export function redirectCategorySlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return categoryRedirects[slug] ?? categoryRedirects[slug.toLowerCase()];
}

/** Camera-id shortcuts such as `3545` or `IMG_3545` point at `img-3545`. */
export function canonicalProductSlug(slug: string): string | undefined {
  const match = slug.match(/^(?:img[-_])?(\d{4})$/i);
  if (!match) return undefined;
  const canonical = `img-${match[1]}`;
  return canonical === slug ? undefined : canonical;
}
