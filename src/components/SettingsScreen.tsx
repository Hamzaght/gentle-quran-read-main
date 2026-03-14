import { Sun, Moon, Type, Globe, Heart, Languages } from 'lucide-react';
import { AppSettings, TranslationLanguage, LANGUAGE_NAMES } from '@/types/quran';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
}

const fontSizes = [20, 24, 28, 32, 36, 40];
const languages: TranslationLanguage[] = ['en', 'fr', 'de', 'es'];

export default function SettingsScreen({ settings, onUpdateSettings }: SettingsScreenProps) {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Green header */}
      <div className="hero-gradient islamic-pattern rounded-b-[2rem] px-4 pt-6 pb-8">
        <h2 className="text-xl font-bold font-ui text-primary-foreground text-center">Settings</h2>
      </div>

      <div className="px-4 space-y-6 -mt-3">
        {/* Display section */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground font-ui uppercase tracking-wider mb-3 mt-6">Display</h3>
          
          <button
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl mb-2 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
              <span className="text-sm font-ui text-foreground">Dark Mode</span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-muted'} relative`}>
              <div className={`w-5 h-5 rounded-full bg-card absolute top-0.5 transition-transform ${settings.darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </div>
          </button>

          <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Type className="w-5 h-5 text-accent" />
              <span className="text-sm font-ui text-foreground">Font Size</span>
            </div>
            <div className="flex gap-2">
              {fontSizes.map(size => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`flex-1 py-2 rounded-lg text-xs font-ui transition-colors ${
                    settings.fontSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="ayah-text text-center mt-4" style={{ fontSize: `${settings.fontSize}px` }} dir="rtl">بِسْمِ ٱللَّهِ</p>
          </div>
        </section>

        {/* Translation section */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground font-ui uppercase tracking-wider mb-3">Translation</h3>
          
          <button
            onClick={() => onUpdateSettings({ showTranslation: !settings.showTranslation })}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl mb-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-accent" />
              <div>
                <span className="text-sm font-ui text-foreground block">Show Translation</span>
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
              <span className="text-sm font-ui text-foreground">Translation Language</span>
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
        </section>

        {/* Support */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground font-ui uppercase tracking-wider mb-3">Support</h3>
          <div className="p-5 bg-card border border-border rounded-xl text-center shadow-sm">
            <Heart className="w-8 h-8 text-accent mx-auto mb-3" />
            <p className="text-sm font-ui text-foreground font-medium mb-2">Support the App</p>
            <p className="text-xs text-muted-foreground font-ui leading-relaxed mb-4">
              If you enjoy QuranFlow and want to support its development, you can make a voluntary donation.
            </p>
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium font-ui transition-colors hover:opacity-90">
              Make a Donation
            </button>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground/50 font-ui pb-4">QuranFlow v1.0 · No ads · Free forever</p>
      </div>
    </div>
  );
}
