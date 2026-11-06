export const brand = {
  zh: "MORALUNE",
  en: "OBJECTS FOR LIVING",
  shortEn: "MORALUNE",
} as const;

/**
 * Public v2 marks.
 * Light grounds (Moon Mist header, Soft Clay footer) use the transparent blue wordmark.
 * The Moon Mist plate is only for a surface that intentionally shows that solid plate.
 * Deep Night blocks use the white wordmark. Default page ground stays Moon Mist.
 */
export const wordmarks = {
  light: "/moralune-wordmark-blue-transparent.png",
  onMoonMist: "/moralune-wordmark-blue-on-moon-mist.png",
  dark: "/moralune-wordmark-white-on-deep-night.png",
} as const;

export const marks = {
  moon: "/moralune-mark-moon-blue-transparent.png",
} as const;
