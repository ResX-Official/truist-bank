import { defineRouting } from "next-intl/routing";

export const locales = [
  "en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko",
  "ar", "hi", "tr", "nl", "pl", "sv", "da", "no", "fi", "he",
  "th", "vi", "id", "ms", "ro", "uk", "cs", "hu", "el", "bn",
] as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
