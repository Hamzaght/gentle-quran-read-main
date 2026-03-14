import { Home, BookOpen, List, Bookmark, Settings } from 'lucide-react';

type Tab = 'home' | 'read' | 'surahs' | 'bookmarks' | 'settings';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'read', label: 'Read', icon: BookOpen },
  { id: 'surahs', label: 'Surahs', icon: List },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`p-1 rounded-lg transition-colors ${activeTab === id ? 'bg-primary/10' : ''}`}>
              <Icon className="w-5 h-5" strokeWidth={activeTab === id ? 2.5 : 1.5} />
            </div>
            <span className="text-[10px] font-medium font-ui">{label}</span>
          </button>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
