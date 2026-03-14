import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/components/HomeScreen';
import SurahListScreen from '@/components/SurahListScreen';
import ReadingView from '@/components/ReadingView';
import BookmarkScreen from '@/components/BookmarkScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { useBookmarks, useReadingPosition, useSettings } from '@/hooks/useQuranStore';
import { fetchSurahList } from '@/services/quranApi';
import { Surah } from '@/types/quran';
import { BookOpen } from 'lucide-react';

type Tab = 'home' | 'read' | 'surahs' | 'bookmarks' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [readingSurah, setReadingSurah] = useState<Surah | null>(null);
  const [startAyah, setStartAyah] = useState(1);

  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { position, savePosition } = useReadingPosition();
  const { settings, updateSettings } = useSettings();

  const { data: surahs = [] } = useQuery({
    queryKey: ['surahList'],
    queryFn: fetchSurahList,
    staleTime: Infinity,
  });

  const openSurah = useCallback((surah: Surah, ayah = 1) => {
    setReadingSurah(surah);
    setStartAyah(ayah);
    setActiveTab('read');
  }, []);

  const handleContinueReading = useCallback(() => {
    if (!position) return;
    const surah = surahs.find(s => s.number === position.surahNumber);
    if (surah) openSurah(surah, position.ayahNumber);
  }, [position, surahs, openSurah]);

  const handleSelectSurah = useCallback((surah: Surah) => {
    openSurah(surah, 1);
  }, [openSurah]);

  const handleOpenBookmark = useCallback((surahNumber: number, ayahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (surah) openSurah(surah, ayahNumber);
  }, [surahs, openSurah]);

  const handleBookmark = useCallback((surahNumber: number, ayahNumber: number, previewText: string, surahName: string, surahEnglishName: string) => {
    if (isBookmarked(surahNumber, ayahNumber)) {
      const bm = bookmarks.find(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark({ surahNumber, ayahNumber, previewText, surahName, surahEnglishName });
    }
  }, [isBookmarked, bookmarks, addBookmark, removeBookmark]);

  const handleBackFromReading = useCallback(() => {
    setReadingSurah(null);
    setActiveTab('home');
  }, []);

  const handleNavigateSurah = useCallback((surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (surah) {
      setReadingSurah(surah);
      setStartAyah(1);
      window.scrollTo(0, 0);
    }
  }, [surahs]);

  if (activeTab === 'read' && readingSurah) {
    return (
      <ReadingView
        surah={readingSurah}
        startAyah={startAyah}
        settings={settings}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
        onSavePosition={savePosition}
        onBack={handleBackFromReading}
        lastPosition={position}
        onNavigateSurah={handleNavigateSurah}
        totalSurahs={surahs.length || 114}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen">
      {activeTab === 'home' && (
        <HomeScreen
          position={position}
          settings={settings}
          onUpdateSettings={updateSettings}
          onContinueReading={handleContinueReading}
          onGoToSurahs={() => setActiveTab('surahs')}
          onGoToBookmarks={() => setActiveTab('bookmarks')}
        />
      )}
      {activeTab === 'read' && !readingSurah && (
        <div className="flex flex-col min-h-screen pb-24">
          <div className="hero-gradient islamic-pattern rounded-b-[2rem] px-6 pt-10 pb-8">
            <h2 className="text-xl font-bold font-ui text-primary-foreground text-center">Read</h2>
          </div>
          <div className="px-6 -mt-5 relative z-10">
            {position ? (
              <button
                onClick={handleContinueReading}
                className="w-full max-w-sm mx-auto bg-card border border-border rounded-2xl p-6 text-left transition-all hover:shadow-lg active:scale-[0.98] shadow-md block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground font-ui uppercase tracking-wider">Continue where you left off</span>
                </div>
                <p className="font-arabic text-lg text-foreground">{position.surahName}</p>
                <p className="text-sm text-muted-foreground font-ui mt-1">
                  {position.surahEnglishName} · Ayah {position.ayahNumber}
                </p>
              </button>
            ) : (
              <div className="text-center py-12 bg-card rounded-2xl shadow-md border border-border">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-accent/40" />
                </div>
                <p className="text-sm text-muted-foreground font-ui">No reading history yet</p>
                <button
                  onClick={() => setActiveTab('surahs')}
                  className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium font-ui"
                >
                  Start Reading
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'surahs' && <SurahListScreen onSelectSurah={handleSelectSurah} />}
      {activeTab === 'bookmarks' && <BookmarkScreen bookmarks={bookmarks} onOpenBookmark={handleOpenBookmark} onDeleteBookmark={removeBookmark} />}
      {activeTab === 'settings' && <SettingsScreen settings={settings} onUpdateSettings={updateSettings} />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
