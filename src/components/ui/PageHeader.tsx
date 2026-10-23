import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/30 text-violet-300 shadow-glow">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-fantasy">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
