import { Link, useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Logo } from "@/components/brand";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

export function useGuard() {
  const app = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (app.hydrated && !app.user) navigate({ to: "/login", replace: true });
  }, [app.hydrated, app.user, navigate]);
  return app;
}

export function BackButton({ fallback = "/home" }: { fallback?: string }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: fallback as "/" }))}
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-foreground"
    >
      <ArrowLeft size={20} strokeWidth={1.75} />
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  back = true,
  fallback = "/home",
  right,
  brand = false,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  fallback?: string;
  right?: ReactNode;
  brand?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
      {brand && (
        <div className="mb-3 flex justify-center">
          <Logo height={64} />
        </div>
      )}
      <div className="flex items-center gap-3">
        {back && <BackButton fallback={fallback} />}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold text-heading">{title}</h1>
          {subtitle && <p className="truncate text-[13px] text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

const buttonBase =
  "inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] px-4 text-[15px] font-semibold transition active:scale-[0.99] disabled:opacity-40";

export function PrimaryButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        buttonBase,
        "bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] text-white shadow-[0_8px_20px_rgba(122,34,200,0.22)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(buttonBase, "border border-[#7A22C8] bg-card text-[#7A22C8]", className)}
    >
      {children}
    </button>
  );
}

export function DangerButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn(buttonBase, "border border-danger bg-card text-danger", className)}>
      {children}
    </button>
  );
}

export function PrimaryLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link
      to={to as "/"}
      className={cn(
        buttonBase,
        "bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] text-white shadow-[0_8px_20px_rgba(122,34,200,0.22)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10 dark:shadow-none",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-lg font-semibold text-heading">{children}</h2>
      {action}
    </div>
  );
}

export function TextLink({ children, onClick, to }: { children: ReactNode; onClick?: () => void; to?: string }) {
  const className = "text-sm font-semibold text-blue";
  if (to) {
    return (
      <Link to={to as "/"} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

const fieldClass =
  "h-[52px] w-full rounded-xl border border-border bg-card px-3.5 text-foreground outline-none placeholder:text-muted-foreground focus:border-[#7A22C8] focus:ring-4 focus:ring-[#7A22C8]/15";

export function TextField({
  label,
  error,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      <input {...props} className={cn(fieldClass, error && "border-danger", props.className)} />
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

export function PasswordField({
  label,
  error,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string; error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      <span className="relative block">
        <input {...props} type={show ? "text" : "password"} className={cn(fieldClass, "pr-12", error && "border-danger")} />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((value) => !value)}
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted-foreground"
        >
          {show ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
        </button>
      </span>
      {error && <span className="mt-1 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

export function TextArea({
  label,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      <textarea
        {...props}
        className={cn(fieldClass, "h-auto min-h-32 py-3", error && "border-danger", props.className)}
      />
      {error && <span className="mt-1 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      <select {...props} className={cn(fieldClass, props.className)}>
        {children}
      </select>
    </label>
  );
}

export function AuthCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#7A22C8] via-[#4A28C9] to-[#0FAEE5] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="pointer-events-none absolute -left-16 -top-8 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[#7EE7FF]/30 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-card px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Submitted: "bg-[#F3F4F6] text-[#4B5563] dark:bg-white/10 dark:text-[#D1D5DB]",
  "Under Review": "bg-[#E0F4FC] text-[#075F7A] dark:bg-[#0FAEE5]/15 dark:text-[#8FDBF5]",
  Accepted: "bg-[#DCFCE7] text-[#166534] dark:bg-[#16A34A]/20 dark:text-[#86EFAC]",
  Rejected: "bg-[#FEE2E2] text-[#991B1B] dark:bg-[#DC2626]/20 dark:text-[#FCA5A5]",
  Interview: "bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#7A22C8]/25 dark:text-[#E9D5FF]",
  Offer: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]",
  Hired: "bg-[#16A34A] text-white",
  Withdrawn: "bg-[#F3F4F6] text-[#4B5563] dark:bg-white/10 dark:text-[#D1D5DB]",
  Pending: "bg-[#FEF3C7] text-[#92400E]",
  Eligible: "bg-[#E0F4FC] text-[#075F7A]",
  Earned: "bg-[#FEF3C7] text-[#92400E]",
  Paid: "bg-[#14532D] text-white",
  New: "bg-[#F3F4F6] text-[#4B5563] dark:bg-white/10 dark:text-[#D1D5DB]",
  Shortlisted: "bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#7A22C8]/25 dark:text-[#E9D5FF]",
  Active: "bg-[#DCFCE7] text-[#166534] dark:bg-[#16A34A]/20 dark:text-[#86EFAC]",
  Paused: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]",
  Draft: "bg-[#F3F4F6] text-[#4B5563] dark:bg-white/10 dark:text-[#D1D5DB]",
  Closed: "bg-[#E5E7EB] text-[#374151] dark:bg-white/10 dark:text-[#D1D5DB]",
  "90-Day Retention": "bg-[#CCFBF1] text-[#0F766E] dark:bg-teal-400/15 dark:text-teal-200",
  "Referral Fee Earned": "bg-[#FEF3C7] text-[#92400E] dark:bg-[#F5B301]/20 dark:text-[#F5D98A]",
  Due: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", statusStyles[status] ?? statusStyles.Submitted)}>
      {status}
    </span>
  );
}

export function Sheet({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label="Close sheet" className="absolute inset-0 bg-[#1B1B2F]/50" onClick={onClose} />
      <div className="relative flex max-h-[88dvh] w-full max-w-[390px] flex-col rounded-t-3xl bg-card">
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-border" />
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <h2 className="text-lg font-semibold text-heading">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="flex h-11 w-11 items-center justify-center text-muted-foreground">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer && (
          <div className="border-t border-border px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#1B1B2F]/50" aria-label="Dismiss" onClick={onClose} />
      <div className="relative m-4 w-full max-w-[358px] rounded-3xl bg-card p-5">
        <h2 className="text-lg font-semibold text-heading">{title}</h2>
        <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{body}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          {danger ? (
            <button
              type="button"
              onClick={onConfirm}
              className={cn(buttonBase, "bg-danger text-white")}
            >
              {confirmLabel}
            </button>
          ) : (
            <PrimaryButton onClick={onConfirm}>{confirmLabel}</PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex min-h-12 w-full items-center gap-3 py-2 text-left">
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">{hint}</span>}
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition",
          checked ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" : "bg-[#E5E7EB] dark:bg-white/15",
        )}
      >
        <span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition", checked ? "left-5" : "left-0.5")} />
      </span>
    </button>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card px-6 py-10 text-center shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10 dark:shadow-none">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#F3E8FF] to-[#E0F4FC] text-[#7A22C8] dark:from-[#7A22C8]/30 dark:to-[#0FAEE5]/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-heading">{title}</h3>
      <p className="mx-auto mt-2 max-w-[260px] text-sm leading-5 text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-[#E6E8F0] dark:bg-white/10", className)} />;
}

export function ProgressRing({ value }: { value: number }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 72 72" className="h-16 w-16 -rotate-90">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-[#E5E7EB] dark:text-white/10" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7A22C8" />
            <stop offset="100%" stopColor="#0FAEE5" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-heading">{value}%</span>
    </div>
  );
}

export function SuccessMark() {
  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] text-white shadow-[0_10px_24px_rgba(122,34,200,0.28)] animate-[splash-pop_0.45s_ease]">
      <Check size={36} strokeWidth={2.25} />
    </div>
  );
}

export function Avatar({
  src,
  name,
  className,
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (!src || failed) {
    return (
      <span className={cn("flex items-center justify-center rounded-full bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] font-semibold text-white", className)}>
        {initials}
      </span>
    );
  }
  return <img src={src} alt="" onError={() => setFailed(true)} className={cn("rounded-full object-cover", className)} />;
}

export function RangeSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number[];
  min: number;
  max: number;
  step: number;
  onChange: (value: number[]) => void;
}) {
  return (
    <Slider.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onChange}
      className="relative flex h-11 w-full touch-none items-center"
    >
      <Slider.Track className="relative h-1.5 grow rounded-full bg-[#E5E7EB] dark:bg-white/10">
        <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" />
      </Slider.Track>
      {value.map((_, index) => (
        <Slider.Thumb
          key={index}
          className="block h-6 w-6 rounded-full border-2 border-white bg-[#7A22C8] shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7A22C8]/30"
        />
      ))}
    </Slider.Root>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-[13px] font-semibold",
        active
          ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-white"
          : "border border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function PasswordChecklist({ password }: { password: string }) {
  const rules = [
    [password.length >= 8, "At least 8 characters"],
    [/[A-Z]/.test(password), "One uppercase letter"],
    [/[a-z]/.test(password), "One lowercase letter"],
    [/\d/.test(password), "One number"],
  ] as const;
  return (
    <ul className="mb-4 space-y-1">
      {rules.map(([ok, label]) => (
        <li key={label} className={cn("flex items-center gap-2 text-xs", ok ? "text-success" : "text-muted-foreground")}>
          <Check size={12} /> {label}
        </li>
      ))}
    </ul>
  );
}

export function strengthOk(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}
