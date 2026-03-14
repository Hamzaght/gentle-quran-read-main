import { useState, useEffect, useCallback } from 'react';
import { Bookmark, ReadingPosition, AppSettings, TranslationLanguage } from '@/types/quran';

const BOOKMARKS_KEY = 'qf_bookmarks';
const POSITION_KEY = 'qf_reading_position';
const SETTINGS_KEY = 'qf_settings';

// Bookmarks hook
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber);
      if (exists) return prev;
      return [...prev, { ...bookmark, id: crypto.randomUUID(), createdAt: Date.now() }];
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const isBookmarked = useCallback((surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
  }, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}

// Reading position hook
export function useReadingPosition() {
  const [position, setPosition] = useState<ReadingPosition | null>(() => {
    const stored = localStorage.getItem(POSITION_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const savePosition = useCallback((pos: ReadingPosition) => {
    setPosition(pos);
    localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
  }, []);

  return { position, savePosition };
}

// Settings hook
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {
      fontSize: 28,
      showTranslation: true,
      translationLanguage: 'en' as TranslationLanguage,
      darkMode: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  return { settings, updateSettings };
}
