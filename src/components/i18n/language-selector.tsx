"use client";

import { APP_LANGUAGE_COOKIE, type AppLanguage, languageOptions } from "@/lib/i18n/dictionaries";

type LanguageSelectorProps = {
  currentLanguage: AppLanguage;
  label: string;
};

export default function LanguageSelector({ currentLanguage, label }: LanguageSelectorProps) {
  const handleLanguageChange = (nextLanguage: AppLanguage) => {
    document.cookie = `${APP_LANGUAGE_COOKIE}=${nextLanguage}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-white/30 px-2 py-1 text-xs sm:text-sm">
      <span className="text-slate-200">{label}</span>
      <select
        value={currentLanguage}
        onChange={(event) => handleLanguageChange(event.target.value as AppLanguage)}
        className="rounded bg-white/10 px-2 py-1 text-white outline-none"
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code} className="text-slate-900">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
