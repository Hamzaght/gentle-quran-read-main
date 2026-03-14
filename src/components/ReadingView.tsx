import { useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookmarkPlus, BookmarkCheck, Share2, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { fetchSurahAyahs, fetchTranslation } from '@/services/quranApi';
import { Surah, ReadingPosition, AppSettings } from '@/types/quran';

interface ReadingViewProps {
  surah: Surah;
  startAyah?: number;
  settings: AppSettings;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  onBookmark: (surahNumber: number, ayahNumber: number, previewText: string, surahName: string, surahEnglishName: string) => void;
  onSavePosition: (pos: ReadingPosition) => void;
  onBack: () => void;
  lastPosition?: ReadingPosition | null;
  onNavigateSurah?: (surahNumber: number) => void;
  totalSurahs?: number;
}

export default function ReadingView({
  surah, startAyah = 1, settings, isBookmarked, onBookmark, onSavePosition, onBack, lastPosition, onNavigateSurah, totalSurahs = 114,
}: ReadingViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const { data: ayahs = [], isLoading: loadingAyahs } = useQuery({
    queryKey: ['surahAyahs', surah.number],
    queryFn: () => fetchSurahAyahs(surah.number),
    staleTime: Infinity,
  });

  const { data: translations = [] } = useQuery({
    queryKey: ['translation', surah.number, settings.translationLanguage],
    queryFn: () => fetchTranslation(surah.number, settings.translationLanguage),
    enabled: settings.showTranslation,
    staleTime: Infinity,
  });

  const isLastReadAyah = (ayahNum: number) =>
    lastPosition?.surahNumber === surah.number && lastPosition?.ayahNumber === ayahNum;

  useEffect(() => {
    if (ayahs.length > 0 && startAyah > 1) {
      const el = ayahRefs.current.get(startAyah);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [ayahs, startAyah]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || ayahs.length === 0) return;
    let closestAyah = 1;
    let closestDist = Infinity;
    ayahRefs.current.forEach((el, num) => {
      const dist = Math.abs(el.getBoundingClientRect().top - 80);
      if (dist < closestDist) { closestDist = dist; closestAyah = num; }
    });
    onSavePosition({ surahNumber: surah.number, surahName: surah.name, surahEnglishName: surah.englishName, ayahNumber: closestAyah });
  }, [ayahs, surah, onSavePosition]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let timeout: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => { clearTimeout(timeout); timeout = setTimeout(handleScroll, 300); };
    container.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => { container.removeEventListener('scroll', debouncedScroll); clearTimeout(timeout); };
  }, [handleScroll]);

  const handleShare = async (ayahText: string, ayahNum: number) => {
    const text = `${ayahText}\n\n— ${surah.englishName} ${ayahNum}`;
    if (navigator.share) { try { await navigator.share({ text }); } catch {} } else { await navigator.clipboard.writeText(text); }
  };

  const fontSize = settings.fontSize;
  const hasPrev = surah.number > 1;
  const hasNext = surah.number < totalSurahs;

  return (
    <div ref={scrollRef} className="min-h-screen pb-20 overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="hero-gradient islamic-pattern sticky top-0 z-20">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-primary-foreground/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium font-ui text-primary-foreground truncate">{surah.englishName}</p>
            <p className="text-xs text-primary-foreground/60 font-ui">{surah.numberOfAyahs} Ayahs</p>
          </div>
          <p className="font-arabic text-xl text-gold">{surah.name}</p>
        </div>
      </div>

      {/* Surah title ornament */}
      <div className="flex justify-center py-8">
        <div className="ornament-border rounded-xl px-8 py-3 text-center">
          <p className="surah-header text-xl text-foreground">سُورَةُ {surah.name.replace('سُورَةُ ', '')}</p>
        </div>
      </div>

      {/* Bismillah */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center pb-6">
          <p className="ayah-text text-2xl text-accent">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
        </div>
      )}

      {/* Ayahs */}
      <div className="max-w-2xl mx-auto px-4">
        {loadingAyahs ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {ayahs.map((ayah, index) => {
              const bookmarked = isBookmarked(surah.number, ayah.numberInSurah);
              const isMarked = isLastReadAyah(ayah.numberInSurah);
              return (
                <div
                  key={ayah.numberInSurah}
                  ref={el => { if (el) ayahRefs.current.set(ayah.numberInSurah, el); }}
                  className={`py-6 border-b border-border/50 last:border-b-0 rounded-lg px-3 -mx-3 transition-colors ${isMarked ? 'reading-marker' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="ayah-number-badge">{ayah.numberInSurah}</span>
                      {isMarked && (
                        <span className="flex items-center gap-1 text-[10px] font-ui text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                          <Flag className="w-3 h-3" />
                          Last read
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onBookmark(surah.number, ayah.numberInSurah, ayah.text.slice(0, 60), surah.name, surah.englishName)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        {bookmarked ? <BookmarkCheck className="w-4 h-4 text-accent" /> : <BookmarkPlus className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => handleShare(ayah.text, ayah.numberInSurah)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <p className="ayah-text text-right leading-[2.4]" style={{ fontSize: `${fontSize}px` }} dir="rtl">{ayah.text}</p>
                  {settings.showTranslation && translations[index] && (
                    <p className="mt-4 text-sm text-muted-foreground font-ui leading-relaxed">{translations[index]}</p>
                  )}
                </div>
              );
            })}

            {/* Navigation */}
            <div className="gold-divider my-4" />
            <div className="flex items-center justify-between py-6 gap-4">
              {hasPrev ? (
                <button onClick={() => onNavigateSurah?.(surah.number - 1)}
                  className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl hover:shadow-md transition-all flex-1">
                  <ChevronLeft className="w-4 h-4 text-primary" />
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground font-ui uppercase">Previous</p>
                    <p className="text-xs font-medium font-ui text-foreground">Surah {surah.number - 1}</p>
                  </div>
                </button>
              ) : <div className="flex-1" />}
              {hasNext ? (
                <button onClick={() => onNavigateSurah?.(surah.number + 1)}
                  className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl hover:shadow-md transition-all flex-1 justify-end">
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground font-ui uppercase">Next</p>
                    <p className="text-xs font-medium font-ui text-foreground">Surah {surah.number + 1}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </button>
              ) : <div className="flex-1" />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
