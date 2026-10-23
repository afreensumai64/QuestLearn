import { Zap, Crown } from "lucide-react";
import type { UserStats } from "@/types";

interface XPProgressProps {
  stats: UserStats;
}

export function XPProgress({ stats }: XPProgressProps) {
  const percentage = Math.min(
    100,
    Math.round((stats.xp / stats.xpToNextLevel) * 100)
  );
  const remainingXP = stats.xpToNextLevel - stats.xp;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Experience Mastery</span>
              <span className="rounded-md bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-300 border border-violet-500/30">
                Level {stats.level}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {remainingXP.toLocaleString()} XP needed for Level {stats.level + 1}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="font-bold text-slate-200">
              {stats.xp.toLocaleString()}
            </span>
            <span className="text-slate-500"> / {stats.xpToNextLevel.toLocaleString()} XP</span>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-midnight-700/40 px-2.5 py-1 text-gold-400 border border-amber-500/20">
            <Crown className="h-3.5 w-3.5" />
            <span className="font-medium">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-midnight-950/80 p-0.5 border border-midnight-700/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-500 shadow-glow"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
