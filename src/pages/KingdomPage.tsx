import { useState } from "react";
import { Map, Lock, Unlock, Sparkles, ChevronRight, Castle, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { demoRegions, demoUserStats, demoTopics } from "@/data/demoData";
import type { KingdomRegion } from "@/types";

export function KingdomPage({ onStartTopic }: { onStartTopic?: (topicId: string) => void }) {
  const [selectedRegion, setSelectedRegion] = useState<KingdomRegion>(demoRegions[0]);

  return (
    <div>
      <PageHeader
        title="Kingdom of Knowledge"
        subtitle="Explore mystical realms. Conquer topics to liberate territories and expand your empire."
        icon={<Map className="h-6 w-6" />}
      />

      {/* Hero Kingdom Banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/70 via-midnight-900 to-midnight-800/80 p-6 sm:p-8 backdrop-blur-md">
        <div className="relative z-10 max-w-xl">
          <Badge color="gold" className="mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Kingdom Sovereign · Level {demoUserStats.level}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-fantasy tracking-wide">
            The Cartographer's Realm
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Your mastery has liberated 2 of 4 known territories. Deepen your understanding of Computer Science and Machine Learning to reach Level 8 and breach the Quantum Reach.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 hidden md:flex items-center pr-12 opacity-30 pointer-events-none">
          <Castle className="h-48 w-48 text-violet-400" />
        </div>
      </div>

      {/* Regions Grid */}
      <h3 className="mb-4 text-lg font-semibold text-slate-200">Kingdom Territories</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {demoRegions.map((region) => {
          const isUnlocked = demoUserStats.level >= region.unlockLevel;
          const isSelected = selectedRegion.id === region.id;

          return (
            <div
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 backdrop-blur-sm ${
                isSelected
                  ? "border-violet-500 bg-midnight-800/80 shadow-glow"
                  : isUnlocked
                  ? "border-midnight-700/60 bg-midnight-800/50 hover:border-violet-500/40"
                  : "border-midnight-800 bg-midnight-950/60 opacity-60 hover:opacity-80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isUnlocked
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "bg-midnight-800 text-slate-500"
                  }`}
                >
                  {isUnlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <Badge color={isUnlocked ? "cyan" : "slate"}>
                  {isUnlocked ? "Territory Open" : `Req Lvl ${region.unlockLevel}`}
                </Badge>
              </div>

              <h4 className="mt-4 text-base font-bold text-white font-fantasy">
                {region.name}
              </h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                {region.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-midnight-700/40 pt-3">
                <span>{region.topicIds.length} Core Quests</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Territory Details */}
      <div className="mt-8 rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-700/40">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-400" />
              <h3 className="text-xl font-bold text-white font-fantasy">
                {selectedRegion.name}
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-400">{selectedRegion.description}</p>
          </div>
          <Badge color={demoUserStats.level >= selectedRegion.unlockLevel ? "gold" : "rose"}>
            {demoUserStats.level >= selectedRegion.unlockLevel
              ? "Domain Claimed"
              : `Requires Level ${selectedRegion.unlockLevel}`}
          </Badge>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Available Quests in this Realm
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {demoTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-4 rounded-xl border border-midnight-700/40 bg-midnight-900/50 hover:border-violet-500/30 transition-all"
              >
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">{topic.title}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">{topic.estimatedMinutes} min quest</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartTopic?.(topic.id)}
                >
                  Enter
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
