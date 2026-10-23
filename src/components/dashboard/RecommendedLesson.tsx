import { Compass, Sparkles, Coins, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { RecommendedLessonData } from "@/data/demoData";

interface RecommendedLessonProps {
  data: RecommendedLessonData;
  onStart?: () => void;
}

export function RecommendedLesson({ data, onStart }: RecommendedLessonProps) {
  return (
    <div className="rounded-2xl border border-midnight-700/50 bg-gradient-to-b from-midnight-800/80 to-midnight-900/80 p-5 backdrop-blur-sm relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Recommended Quest
          </span>
        </div>
        <Badge color="gold">+{data.xpReward} XP</Badge>
      </div>

      <h4 className="text-base font-bold text-white tracking-tight">
        {data.lessonTitle}
      </h4>
      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
        {data.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-midnight-700/40 pt-3">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          {data.estimatedMinutes}m
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <Coins className="h-3.5 w-3.5" />
          +{data.goldReward} Gold
        </span>
        <span className="flex items-center gap-1 text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          {data.difficulty}
        </span>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onStart}
        className="w-full mt-4"
        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
      >
        Embark on Quest
      </Button>
    </div>
  );
}
