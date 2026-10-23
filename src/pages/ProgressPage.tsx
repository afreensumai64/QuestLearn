import {
  TrendingUp,
  Award,
  Shield,
  Star,
  CheckCircle2,
  Lock,
  Flame,
  Coins,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { XPProgress } from "@/components/dashboard/XPProgress";
import { demoUserStats } from "@/data/demoData";
import { RANKS } from "@/types/constants";

export function ProgressPage() {
  const achievements = [
    {
      id: "first-pdf",
      title: "Archivist Initiate",
      description: "Uploaded and processed your first study document.",
      unlocked: true,
      icon: Award,
      reward: "+100 XP",
    },
    {
      id: "streak-7",
      title: "Unyielding Focus",
      description: "Maintained a 7-day study streak.",
      unlocked: true,
      icon: Flame,
      reward: "+50 Gold",
    },
    {
      id: "streak-14",
      title: "Inferno Master",
      description: "Maintained a 14-day study streak.",
      unlocked: true,
      icon: Flame,
      reward: "+150 Gold",
    },
    {
      id: "quiz-perfect",
      title: "Flawless Trial",
      description: "Answered all checkpoint quiz questions on the first attempt.",
      unlocked: true,
      icon: Star,
      reward: "+200 XP",
    },
    {
      id: "reach-lvl-10",
      title: "Grand Inquisitor",
      description: "Achieve Scholar Level 10.",
      unlocked: false,
      icon: Lock,
      reward: "+500 Gold",
    },
    {
      id: "master-kingdom",
      title: "Kingdom Conqueror",
      description: "Liberate all 4 territorial realms.",
      unlocked: false,
      icon: Lock,
      reward: "+1,000 XP",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Rank & Masteries"
        subtitle="Track your scholar progression, unlock titles, and inspect earned accolades."
        icon={<TrendingUp className="h-6 w-6" />}
      />

      {/* Level XP Banner */}
      <XPProgress stats={demoUserStats} />

      {/* Ranks Ladder */}
      <div className="mt-8 rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white font-fantasy mb-4">
          The Ladder of Enlightenment
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {RANKS.map((rank) => {
            const isEarned = demoUserStats.level >= rank.level;
            const isCurrent = demoUserStats.level >= rank.level && (
              rank === RANKS[RANKS.length - 1] || demoUserStats.level < RANKS[RANKS.indexOf(rank) + 1].level
            );

            return (
              <div
                key={rank.level}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? "border-violet-500 bg-violet-500/15 shadow-glow"
                    : isEarned
                    ? "border-midnight-600 bg-midnight-900/60 text-slate-200"
                    : "border-midnight-800 bg-midnight-950/40 opacity-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Level {rank.level}</span>
                    {isCurrent && <Badge color="violet">Current</Badge>}
                    {isEarned && !isCurrent && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <h4 className="text-sm font-bold text-white font-fantasy">{rank.title}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accolades & Badges */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-white font-fantasy">
          Scholar Accolades & Trophies
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-sm transition-all ${
                  item.unlocked
                    ? "border-midnight-700/60 bg-midnight-800/60 hover:border-violet-500/30"
                    : "border-midnight-800 bg-midnight-950/40 opacity-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      item.unlocked
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-midnight-800 text-slate-600 border border-midnight-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge color={item.unlocked ? "gold" : "slate"}>
                    {item.reward}
                  </Badge>
                </div>
                <h4 className="mt-3 text-base font-bold text-white">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
