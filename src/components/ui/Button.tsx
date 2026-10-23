import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/30 active:scale-[0.98]",
  secondary:
    "bg-midnight-800 text-slate-200 border border-midnight-700 hover:bg-midnight-700 hover:border-slate-600 active:scale-[0.98]",
  outline:
    "bg-transparent text-slate-200 border border-midnight-600 hover:border-violet-500/50 hover:bg-violet-500/10 active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-midnight-800/60 active:scale-[0.98]",
  danger:
    "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 active:scale-[0.98]",
  gold:
    "bg-gradient-to-r from-amber-500 to-amber-600 text-midnight-950 font-bold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98]",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
