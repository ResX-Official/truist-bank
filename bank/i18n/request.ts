import { getRequestConfig } from "next-intl/server";
import { routing } from "./config";

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof override[key] === "object" && override[key] !== null &&
      typeof base[key] === "object" && base[key] !== null
    ) {
      result[key] = deepMerge(base[key] as Record<string, unknown>, override[key] as Record<string, unknown>);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // Always load English as the base, then merge locale on top
  const enMessages = (await import(`../messages/en.json`)).default;

  let localeMessages = {};
  if (locale !== "en") {
    try {
      localeMessages = (await import(`../messages/${locale}.json`)).default;
    } catch {
      localeMessages = {};
    }
  }

  const messages = locale === "en" ? enMessages : deepMerge(enMessages, localeMessages);

  return { locale, messages };
});
