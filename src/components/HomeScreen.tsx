import { BookOpen, List, Bookmark as BookmarkIcon, Star, Globe, Languages } from 'lucide-react';
import { ReadingPosition, AppSettings, TranslationLanguage, LANGUAGE_NAMES } from '@/types/quran';

interface HomeScreenProps {
  position: ReadingPosition | null;
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onContinueReading: () => void;
  onGoToSurahs: () => void;
  onGoToBookmarks: () => void;
}

const languages: TranslationLanguage[] = ['en', 'fr', 'de', 'es'];

export default function HomeScreen({ position, settings, onUpdateSettings, onContinueReading, onGoToSurahs, onGoToBookmarks }: HomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Green hero header with Islamic pattern */}
      <div className="hero-gradient islamic-pattern rounded-b-[2rem] px-6 pt-10 pb-8 relative">
        {/* Decorative stars */}
        <div className="absolute top-4 right-6 opacity-20">
          <Star className="w-4 h-4 text-gold" fill="currentColor" />
        </div>
        <div className="absolute top-8 right-14 opacity-10">
          <Star className="w-3 h-3 text-gold" fill="currentColor" />
        </div>
        <div className="absolute top-6 left-8 opacity-15">
          <Star className="w-3 h-3 text-gold" fill="currentColor" />
        </div>
        
        <div className="text-center relative z-10">
          <h1 className="text-3xl font-bold font-ui tracking-tight text-primary-foreground">QuranFlow</h1>
          <p className="text-sm text-primary-foreground/60 mt-1 font-ui">Read with peace</p>
        </div>

        {/* Bismillah ornament */}
        <div className="mt-6 relative z-10">
          <div className="gold-divider mb-3" />
          <p className="ayah-text text-2xl text-gold text-center py-2">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <div className="gold-divider mt-3" />
        </div>
      </div>

      <div className="px-6 -mt-5 relative z-10">
        {/* Continue Reading Card */}
        {position && (
          <button
            onClick={onContinueReading}
            className="w-full max-w-sm mx-auto bg-card border border-border rounded-2xl p-5 mb-5 text-left transition-all hover:shadow-lg active:scale-[0.98] shadow-md block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground font-ui uppercase tracking-wider">Continue Reading</span>
            </div>
            <p className="font-arabic text-lg text-foreground">{position.surahName}</p>
            <p className="text-sm text-muted-foreground font-ui mt-1">
              {position.surahEnglishName} · Ayah {position.ayahNumber}
            </p>
          </button>
        )}

        {/* Quick shortcuts */}
        <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={onGoToSurahs}
            className="bg-card border border-border rounded-2xl p-5 text-left transition-all hover:shadow-md active:scale-[0.98] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <List className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm font-medium font-ui text-foreground">Surah List</p>
            <p className="text-xs text-muted-foreground font-ui mt-0.5">114 Surahs</p>
          </button>
          <button
            onClick={onGoToBookmarks}
            className="bg-card border border-border rounded-2xl p-5 text-left transition-all hover:shadow-md active:scale-[0.98] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <BookmarkIcon className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm font-medium font-ui text-foreground">Bookmarks</p>
            <p className="text-xs text-muted-foreground font-ui mt-0.5">Saved ayahs</p>
          </button>
        </div>

        {/* Translation section */}
        <div className="w-full max-w-sm mx-auto mt-5">
          <h3 className="text-xs font-semibold text-accent font-ui uppercase tracking-wider mb-3">Translation</h3>
          
          <button
            onClick={() => onUpdateSettings({ showTranslation: !settings.showTranslation })}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl mb-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-accent" />
              <div>
                <span className="text-sm font-ui text-foreground font-medium block">Show Translation</span>
                <span className="text-[10px] text-muted-foreground font-ui">Arabic text always shown as primary</span>
              </div>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${settings.showTranslation ? 'bg-primary' : 'bg-muted'} relative`}>
              <div className={`w-5 h-5 rounded-full bg-card absolute top-0.5 transition-transform ${settings.showTranslation ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </div>
          </button>

          <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Languages className="w-5 h-5 text-accent" />
              <span className="text-sm font-ui text-foreground font-medium">Translation Language</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => onUpdateSettings({ translationLanguage: lang })}
                  className={`p-3 rounded-xl text-sm font-ui transition-colors border ${
                    settings.translationLanguage === lang
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                  }`}
                >
                  {LANGUAGE_NAMES[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
