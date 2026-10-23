import { Sparkles, Coins, Flame, Award } from "lucide-react";
import type { UserStats } from "@/types";

interface StatCardProps {
  stats: UserStats;
}

export function StatCard({ stats }: StatCardProps) {
  const cards = [
    {
      label: "Scholar Level",
      value: `Lvl ${stats.level}`,
      subvalue: stats.rankTitle,
      icon: Sparkles,
      color: "from-violet-500/20 to-indigo-500/10",
      border: "border-violet-500/30",
      text: "text-violet-400",
      glow: "hover:shadow-glow",
    },
    {
      label: "Gold Coins",
      value: stats.gold.toLocaleString(),
      subvalue: "Quest currency",
      icon: Coins,
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "hover:shadow-glow-gold",
    },
    {
      label: "Day Streak",
      value: `${stats.streak} Days`,
      subvalue: "On a learning roll!",
      icon: Flame,
      color: "from-rose-500/20 to-orange-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      glow: "hover:shadow-rose-500/20",
    },
    {
      label: "Mastered Lessons",
      value: `${stats.lessonsCompleted}`,
      subvalue: `${stats.topicsCompleted} topics mastered`,
      icon: Award,
      color: "from-cyan-500/20 to-teal-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      glow: "hover:shadow-glow-cyan",
    },
  ];

  return (
    <>
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border ${item.border} bg-midnight-800/60 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 ${item.glow} hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{item.label}</span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} ${item.text}`}
              >
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {item.value}
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-400">{item.subvalue}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}
