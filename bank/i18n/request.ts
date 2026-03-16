import { getRequestConfig } from "next-intl/server";
import { routing } from "./config";

import en from "../messages/en.json";
import es from "../messages/es.json";
import fr from "../messages/fr.json";
import de from "../messages/de.json";
import it from "../messages/it.json";
import pt from "../messages/pt.json";
import ru from "../messages/ru.json";
import zh from "../messages/zh.json";
import ja from "../messages/ja.json";
import ko from "../messages/ko.json";
import ar from "../messages/ar.json";
import hi from "../messages/hi.json";
import tr from "../messages/tr.json";
import nl from "../messages/nl.json";
import pl from "../messages/pl.json";
import sv from "../messages/sv.json";
import da from "../messages/da.json";
import no from "../messages/no.json";
import fi from "../messages/fi.json";
import he from "../messages/he.json";
import th from "../messages/th.json";
import vi from "../messages/vi.json";
import id from "../messages/id.json";
import ms from "../messages/ms.json";
import ro from "../messages/ro.json";
import uk from "../messages/uk.json";
import cs from "../messages/cs.json";
import hu from "../messages/hu.json";
import el from "../messages/el.json";
import bn from "../messages/bn.json";

type MessageRecord = Record<string, unknown>;

const allMessages: Record<string, MessageRecord> = {
  en, es, fr, de, it, pt, ru, zh, ja, ko,
  ar, hi, tr, nl, pl, sv, da, no, fi, he,
  th, vi, id, ms, ro, uk, cs, hu, el, bn,
};

function deepMerge(base: MessageRecord, override: MessageRecord): MessageRecord {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof override[key] === "object" && override[key] !== null &&
      typeof base[key] === "object" && base[key] !== null
    ) {
      result[key] = deepMerge(base[key] as MessageRecord, override[key] as MessageRecord);
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

  const localeMessages = allMessages[locale] ?? {};
  const messages = locale === "en" ? en : deepMerge(en as MessageRecord, localeMessages);

  return { locale, messages };
});
