import { cookies } from "next/headers";
import { APP_LANGUAGE_COOKIE, dictionaries, normalizeLanguage } from "./dictionaries";

export async function getServerI18n() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(APP_LANGUAGE_COOKIE)?.value);

  return {
    language,
    dictionary: dictionaries[language],
  };
}
