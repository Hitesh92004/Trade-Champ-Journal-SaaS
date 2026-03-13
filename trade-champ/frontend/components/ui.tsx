import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-neon/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-neon transition hover:bg-neon",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-xl p-5 shadow-purple", className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-neon focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
