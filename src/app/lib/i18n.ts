export type Lang = "en" | "ta";

/** A bilingual string pair. */
export type Bi = { en: string; ta: string };

/** Pick the active-language string from a pair. */
export function t(lang: Lang, pair: Bi): string {
  return lang === "ta" ? pair.ta : pair.en;
}

/** Shorthand bilingual literal builder. */
export function bi(en: string, ta: string): Bi {
  return { en, ta };
}
