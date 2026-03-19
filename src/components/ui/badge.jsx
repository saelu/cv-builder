import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variantClass =
    variant === "secondary"
      ? "bg-slate-100 text-slate-700 border border-slate-200"
      : "bg-slate-900 text-white";

  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium", variantClass, className)}
      {...props}
    />
  );
}
