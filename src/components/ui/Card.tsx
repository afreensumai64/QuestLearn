import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = "", glow = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm transition-all duration-200 ${
        glow ? "hover:border-violet-500/40 hover:shadow-glow" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
