import { Surah, Ayah, TRANSLATION_EDITIONS, TranslationLanguage } from '@/types/quran';

const API_BASE = 'https://api.alquran.cloud/v1';

const cache = new Map<string, any>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url);
  
  // Check localStorage cache
  const stored = localStorage.getItem(`qf_cache_${url}`);
  if (stored) {
    const parsed = JSON.parse(stored);
    cache.set(url, parsed);
    return parsed;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  const data = json.data;
  
  cache.set(url, data);
  try {
    localStorage.setItem(`qf_cache_${url}`, JSON.stringify(data));
  } catch (e) {
    // localStorage full, ignore
  }
  return data;
}

export async function fetchSurahList(): Promise<Surah[]> {
  const data = await fetchWithCache<any[]>(`${API_BASE}/surah`);
  return data.map((s: any) => ({
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType,
  }));
}

export async function fetchSurahAyahs(surahNumber: number): Promise<Ayah[]> {
  const data = await fetchWithCache<any>(`${API_BASE}/surah/${surahNumber}`);
  return data.ayahs.map((a: any) => ({
    number: a.number,
    text: a.text,
    numberInSurah: a.numberInSurah,
    juz: a.juz,
    page: a.page,
    surah: {
      number: data.number,
      name: data.name,
      englishName: data.englishName,
    },
  }));
}

export async function fetchTranslation(surahNumber: number, lang: TranslationLanguage): Promise<string[]> {
  const edition = TRANSLATION_EDITIONS[lang];
  const data = await fetchWithCache<any>(`${API_BASE}/surah/${surahNumber}/${edition}`);
  return data.ayahs.map((a: any) => a.text);
}
