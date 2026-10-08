import { Link } from "@tanstack/react-router";
import { Bell, Star } from "lucide-react";
import type { ReactNode } from "react";
import { BackButton } from "@/components/ui-app";
import { cn } from "@/lib/utils";

export function GradientHeader({
  title,
  subtitle,
  back,
  fallback = "/overview",
  right,
  children,
  compact,
}: {
  title?: string;
  subtitle?: string;
  back?: boolean;
  fallback?: string;
  right?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header className={cn("relative overflow-hidden bg-gradient-to-br from-[#5B1496] via-[#7A22C8] to-[#8E4AD4] text-white", compact ? "px-4 pb-5" : "px-4 pb-6")}>
      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className={cn("relative", "pt-[max(0.75rem,env(safe-area-inset-top))]")}>
        {(title || back || right) && (
          <div className="flex items-center gap-3">
            {back && (
              <div className="[&_button]:border-white/20 [&_button]:bg-white/15 [&_button]:text-white">
                <BackButton fallback={fallback} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && <h1 className="truncate text-2xl font-semibold leading-7">{title}</h1>}
              {subtitle && <p className="truncate text-[13px] text-white/80">{subtitle}</p>}
            </div>
            {right}
          </div>
        )}
        {children}
      </div>
    </header>
  );
}

export function BellButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button type="button" aria-label="Notifications" onClick={onClick} className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
      <Bell size={20} strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5B301] px-1 text-[10px] font-bold text-[#2B1F6E]">
          {count}
        </span>
      )}
    </button>
  );
}

export function EmployerChip() {
  return <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">Employer</span>;
}

export function CompanyMark({ letter, className }: { letter: string; className?: string }) {
  return (
    <span className={cn("flex items-center justify-center rounded-2xl bg-white font-bold text-[#7A22C8]", className)}>
      {letter}
    </span>
  );
}

export function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const w = 112;
  const h = 36;
  const coords = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * w;
      const y = h - ((point - min) / Math.max(max - min, 1)) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-28">
      <polyline fill="none" stroke="#7A22C8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={coords} />
    </svg>
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(...steps.map((step) => step.value), 1);
  return (
    <div className="space-y-2.5">
      {steps.map((step) => (
        <div key={step.label}>
          <div className="mb-1 flex items-center justify-between text-[13px]">
            <span className="font-medium text-foreground">{step.label}</span>
            <span className="font-semibold text-heading">{step.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#EEF0F6] dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" style={{ width: `${Math.max(8, (step.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#F5B301]">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={12} strokeWidth={1.75} fill={index < Math.round(value) ? "currentColor" : "none"} />
      ))}
      <span className="ml-1 text-[12px] font-semibold text-foreground">{value.toFixed(1)}</span>
    </span>
  );
}

export function SettingsRow({ to, label, hint, onClick }: { to?: string; label: string; hint?: string; onClick?: () => void }) {
  const className = "flex min-h-14 w-full items-center justify-between gap-3 border-b border-border py-3 text-left last:border-0";
  const body = (
    <>
      <span>
        <span className="block text-[15px] font-medium text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <span className="text-muted-foreground">›</span>
    </>
  );
  if (to) {
    return (
      <Link to={to as "/"} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}
