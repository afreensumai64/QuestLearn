import { Binary, Brain, Sigma, Atom, Layers, ChevronRight } from "lucide-react";
import type { Subject } from "@/data/demoData";

interface SubjectCardProps {
  subject: Subject;
  onClick?: (subject: Subject) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Binary,
  Brain,
  Sigma,
  Atom,
};

const colorMap: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "group-hover:border-violet-500/40",
    bar: "from-violet-500 to-indigo-500",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "group-hover:border-cyan-500/40",
    bar: "from-cyan-500 to-blue-500",
  },
  gold: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "group-hover:border-amber-500/40",
    bar: "from-amber-500 to-yellow-500",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "group-hover:border-rose-500/40",
    bar: "from-rose-500 to-pink-500",
  },
};

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const IconComponent = iconMap[subject.icon] || Layers;
  const theme = colorMap[subject.color] || colorMap.violet;

  return (
    <div
      onClick={() => onClick?.(subject)}
      className={`group cursor-pointer rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.border}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.bg} ${theme.text} transition-transform group-hover:scale-110`}
        >
          <IconComponent className="h-6 w-6" />
        </div>
        <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-slate-300" />
      </div>

      <h4 className="mt-4 text-base font-bold text-white group-hover:text-violet-300 transition-colors">
        {subject.name}
      </h4>
      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{subject.description}</p>

      <div className="mt-4 pt-3 border-t border-midnight-700/40">
        <div className="flex items-center justify-between text-xs mb-1.5 text-slate-400">
          <span>{subject.topicsCount} Topics</span>
          <span className="font-semibold text-slate-200">{subject.progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-midnight-950">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
            style={{ width: `${subject.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
