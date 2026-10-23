import { Play, Clock, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ContinueLearningData } from "@/data/demoData";

interface ContinueLearningProps {
  data: ContinueLearningData;
  onResume?: () => void;
}

export function ContinueLearning({ data, onResume }: ContinueLearningProps) {
  return (
    <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm animate-slide-up flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge color="violet">{data.category}</Badge>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            ~{data.remainingMinutes} min left
          </span>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          {data.topicTitle}
        </h3>
        <p className="mt-1 text-sm text-slate-300 font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-violet-400 flex-shrink-0" />
          <span>{data.lessonTitle}</span>
        </p>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">Quest Progress</span>
            <span className="font-semibold text-violet-300">{data.progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-midnight-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${data.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-midnight-700/40 flex items-center justify-between">
        <span className="text-xs text-slate-400">Ready to test your knowledge?</span>
        <Button
          variant="primary"
          size="sm"
          onClick={onResume}
          leftIcon={<Play className="h-3.5 w-3.5 fill-current" />}
          rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
        >
          Resume Lesson
        </Button>
      </div>
    </div>
  );
}
