import { ref, watch } from "vue";
import { useCookie } from "#app";
import locales from "../config/locales.js"; // your translations

type LocaleKeys = "en" | "km";
type LocalesType = Record<string, Record<LocaleKeys, string>>;

export default defineNuxtPlugin((nuxtApp) => {
  const languageCookie = useCookie("lang", { default: () => "en" });
  const currentLang = ref<LocaleKeys>(languageCookie.value as LocaleKeys);

  watch(languageCookie, (newLang) => {
    currentLang.value = (newLang === "en" || newLang === "km" ? newLang : "en") as LocaleKeys;
  });

  const translate = (dataOrKey: string | Record<LocaleKeys, string>): string => {
    const lang = currentLang.value;

    if (typeof dataOrKey === "string") {
      return (locales as LocalesType)[dataOrKey]?.[lang] || (locales as LocalesType)[dataOrKey]?.["en"] || dataOrKey;
    }

    return dataOrKey[lang] || dataOrKey["en"];
  };

  // PROVIDE FUNCTION and reactive currentLang
  nuxtApp.provide("translate", translate);
  nuxtApp.provide("currentLang", currentLang);
});
