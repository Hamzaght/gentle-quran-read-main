import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { fetchSurahList } from '@/services/quranApi';
import { Surah } from '@/types/quran';

interface SurahListScreenProps {
  onSelectSurah: (surah: Surah) => void;
}

export default function SurahListScreen({ onSelectSurah }: SurahListScreenProps) {
  const [search, setSearch] = useState('');
  const { data: surahs = [], isLoading } = useQuery({
    queryKey: ['surahList'],
    queryFn: fetchSurahList,
    staleTime: Infinity,
  });

  const filtered = surahs.filter(s => {
    const q = search.toLowerCase();
    return (
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(search) ||
      s.number.toString() === q
    );
  });

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Green header */}
      <div className="hero-gradient islamic-pattern rounded-b-[2rem] px-4 pt-6 pb-8">
        <h2 className="text-xl font-bold font-ui mb-4 text-primary-foreground text-center">Surahs</h2>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search surah name or number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card rounded-xl py-2.5 pl-10 pr-4 text-sm font-ui text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/40 shadow-sm"
          />
        </div>
      </div>

      <div className="px-4 flex-1 -mt-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map(surah => (
              <button
                key={surah.number}
                onClick={() => onSelectSurah(surah)}
                className="w-full flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-card hover:shadow-sm active:bg-secondary bg-transparent"
              >
                <div className="surah-diamond rounded-md flex-shrink-0">
                  <span>{surah.number}</span>
                </div>
                <div className="flex-1 text-left min-w-0 ml-1">
                  <p className="text-sm font-medium font-ui text-foreground">{surah.englishName}</p>
                  <p className="text-xs text-muted-foreground font-ui">{surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs</p>
                </div>
                <p className="font-arabic text-lg text-foreground flex-shrink-0">{surah.name}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
