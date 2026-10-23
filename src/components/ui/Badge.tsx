import React from "react";

export type BadgeColor = "cyan" | "gold" | "rose" | "slate" | "violet" | "emerald";

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colorStyles: Record<BadgeColor, string> = {
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  gold: "bg-gold-500/15 text-gold-300 border-gold-500/30",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  slate: "bg-slate-700/40 text-slate-300 border-slate-600/40",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function Badge({ color = "slate", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorStyles[color]} ${className}`}
    >
      {children}
    </span>
  );
}
