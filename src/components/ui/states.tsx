import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-midnight-700/50 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-rose-200">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-rose-300/80 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading quests..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <Loader2 className="h-8 w-8 animate-spin text-violet-400 mb-3" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}
