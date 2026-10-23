import { Flame, Check } from "lucide-react";
import type { StreakDay } from "@/data/demoData";

interface StreakDisplayProps {
  streak: number;
  days: StreakDay[];
}

export function StreakDisplay({ streak, days }: StreakDisplayProps) {
  return (
    <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Flame className="h-5 w-5 fill-orange-500/40" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Daily Streak</h4>
            <p className="text-xs text-orange-400 font-medium">{streak} Days Strong 🔥</p>
          </div>
        </div>
        <span className="text-xs text-slate-500">Keep it up!</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {days.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-400">{item.day}</span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                item.active
                  ? "bg-gradient-to-br from-amber-500 to-orange-500 text-midnight-950 shadow-md shadow-orange-500/20"
                  : "bg-midnight-900 border border-midnight-700 text-slate-600"
              }`}
            >
              {item.active ? <Check className="h-4 w-4 stroke-[2.5]" /> : "·"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
