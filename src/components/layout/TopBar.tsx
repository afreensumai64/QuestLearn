import { Menu, Coins, Flame, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/gameStore";

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onQuickUpload: () => void;
}

export function TopBar({ onOpenMobileMenu, onQuickUpload }: TopBarProps) {
  const stats = useGameStore((s) => s.stats);
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-midnight-700/60 bg-midnight-950/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-400 hover:bg-midnight-800 hover:text-slate-200 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-slate-300 hidden sm:inline-block font-fantasy">
          The Grand Archives
        </span>
      </div>

      {/* Top right stats */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
          <Flame className="h-3.5 w-3.5 fill-orange-500" />
          <span>{stats.streak}d</span>
        </div>

        {/* Gold Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
          <Coins className="h-3.5 w-3.5" />
          <span>{stats.gold.toLocaleString()}</span>
        </div>

        {/* Quick Upload Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onQuickUpload}
          leftIcon={<Plus className="h-4 w-4" />}
          className="hidden md:inline-flex border-violet-500/40 text-violet-300 hover:bg-violet-500/15"
        >
          Add Material
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 border-l border-midnight-700/60 pl-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-glow">
            AS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-none">Scholar</p>
            <span className="flex items-center gap-1 text-[10px] text-violet-400 font-medium">
              <ShieldCheck className="h-3 w-3" />
              Lvl {stats.level}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
