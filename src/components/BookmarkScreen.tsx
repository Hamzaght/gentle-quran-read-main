import { BookOpen, Trash2 } from 'lucide-react';
import { Bookmark } from '@/types/quran';

interface BookmarkScreenProps {
  bookmarks: Bookmark[];
  onOpenBookmark: (surahNumber: number, ayahNumber: number) => void;
  onDeleteBookmark: (id: string) => void;
}

export default function BookmarkScreen({ bookmarks, onOpenBookmark, onDeleteBookmark }: BookmarkScreenProps) {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Green header */}
      <div className="hero-gradient islamic-pattern rounded-b-[2rem] px-4 pt-6 pb-8">
        <h2 className="text-xl font-bold font-ui text-primary-foreground text-center">Bookmarks</h2>
      </div>

      <div className="px-4 flex-1 -mt-3">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-accent/40" />
            </div>
            <p className="text-sm text-muted-foreground font-ui">No bookmarks yet</p>
            <p className="text-xs text-muted-foreground/70 font-ui mt-1">Bookmark ayahs while reading to find them here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.sort((a, b) => b.createdAt - a.createdAt).map(bookmark => (
              <div
                key={bookmark.id}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 shadow-sm"
              >
                <button
                  onClick={() => onOpenBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-sm font-medium font-ui text-foreground">{bookmark.surahEnglishName}</p>
                  <p className="text-xs text-muted-foreground font-ui mt-0.5">Ayah {bookmark.ayahNumber}</p>
                  <p className="font-arabic text-sm text-foreground/70 mt-1 truncate" dir="rtl">{bookmark.previewText}</p>
                </button>
                <button
                  onClick={() => onDeleteBookmark(bookmark.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
