import {
  Castle,
  Map,
  BookOpen,
  Library,
  TrendingUp,
  X,
  Sparkles,
} from "lucide-react";

export type PageTab = "dashboard" | "kingdom" | "learn" | "library" | "progress";

interface SidebarProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentTab, onSelectTab, isOpen, onClose }: SidebarProps) {
  const navItems: { id: PageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "dashboard", label: "Quest Hall", icon: Castle },
    { id: "kingdom", label: "Kingdom Map", icon: Map },
    { id: "learn", label: "Quests & Study", icon: BookOpen },
    { id: "library", label: "Knowledge Library", icon: Library },
    { id: "progress", label: "Rank & Mastery", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-midnight-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-midnight-700/60 bg-midnight-900/95 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-midnight-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-glow">
              <Castle className="h-5 w-5" />
            </div>
            <div>
              <span className="font-fantasy text-lg font-bold tracking-wider text-white">
                QuestLearn
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-violet-400">
                RPG Study Realm
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-midnight-800 hover:text-slate-200 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-glow"
                    : "text-slate-400 hover:bg-midnight-800/60 hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-violet-400" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-violet-400 shadow-glow" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Kingdom Level Banner */}
        <div className="p-4 m-3 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-900/30 to-midnight-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold">
            <Sparkles className="h-4 w-4" />
            <span>Kingdom Status</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Citadel unlocked. Extract more PDFs to expand your territories.
          </p>
        </div>
      </aside>
    </>
  );
}
