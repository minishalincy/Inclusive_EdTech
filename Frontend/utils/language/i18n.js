import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: require("./en/translation.json"),
  },
  hi: {
    translation: require("./hi/translation.json"),
  },
  bn: {
    translation: require("./bn/translation.json"), // Bengali
  },
  gu: {
    translation: require("./gu/translation.json"), // Gujarati
  },
  kn: {
    translation: require("./kn/translation.json"), // Kannada
  },
  mr: {
    translation: require("./mr/translation.json"), // Marathi
  },
  pa: {
    translation: require("./pa/translation.json"), // Punjabi
  },
  ta: {
    translation: require("./ta/translation.json"), // Tamil
  },
  te: {
    translation: require("./te/translation.json"), // Telugu
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
