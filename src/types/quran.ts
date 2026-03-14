export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  previewText: string;
  createdAt: number;
}

export interface ReadingPosition {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
}

export type TranslationLanguage = 'en' | 'fr' | 'de' | 'es';

export interface AppSettings {
  fontSize: number;
  showTranslation: boolean;
  translationLanguage: TranslationLanguage;
  darkMode: boolean;
}

export const TRANSLATION_EDITIONS: Record<TranslationLanguage, string> = {
  en: 'en.asad',
  fr: 'fr.hamidullah',
  de: 'de.aburida',
  es: 'es.cortes',
};

export const LANGUAGE_NAMES: Record<TranslationLanguage, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
};
