import { Link, useRouterState } from "@tanstack/react-router";
import { Briefcase, LayoutDashboard, Settings, Users, UserSearch, WifiOff } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "@/components/ui-app";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/talent", label: "Talent", icon: UserSearch },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

const AUTH = ["/", "/onboarding", "/welcome", "/login", "/signup", "/verify", "/forgot", "/reset", "/setup"];

function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  return online;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const path = pathname.replace(/\/$/, "") || "/";
  const showTabs = TABS.some((tab) => tab.to === path);
  const online = useOnline();
  const auth = AUTH.includes(path);
  const { toasts, dismissToast } = useApp();

  return (
    <div className="min-h-dvh bg-[#DDD7EC] dark:bg-[#070512]">
      <div className="relative mx-auto min-h-dvh w-full max-w-[390px] bg-background min-[500px]:shadow-[0_0_0_1px_rgba(43,31,110,0.08),0_24px_80px_rgba(43,31,110,0.18)]">
        {!online && !auth ? <Offline /> : children}
        {showTabs && online && (
          <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur pb-[max(0.35rem,env(safe-area-inset-bottom))]">
            <div className="grid grid-cols-5">
              {TABS.map((tab) => {
                const active = path === tab.to;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.to}
                    to={tab.to as "/"}
                    className={cn(
                      "relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium",
                      active ? "text-[#7A22C8]" : "text-muted-foreground",
                    )}
                  >
                    {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" />}
                    <Icon size={20} strokeWidth={1.75} />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[60] flex w-full max-w-[390px] -translate-x-1/2 flex-col gap-2 px-4">
          {toasts.map((toast) => (
            <button
              key={toast.id}
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto rounded-2xl bg-[#2B1F6E] px-4 py-3 text-left text-white shadow-lg"
            >
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.body && <p className="text-xs text-white/75">{toast.body}</p>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Offline() {
  const [tried, setTried] = useState(false);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 pb-10 pt-[max(2rem,env(safe-area-inset-top))] text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#7A22C8]/20 dark:text-[#E9D5FF]">
        <WifiOff size={32} strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-semibold text-heading">You’re offline</h1>
      <p className="mt-2 max-w-[280px] text-[15px] leading-6 text-muted-foreground">
        Check your connection and try again. Requisitions and reviews will be here when you’re back.
      </p>
      {tried && <p className="mt-3 text-sm font-medium text-danger">Still no connection.</p>}
      <PrimaryButton
        className="mt-6 w-full"
        onClick={() => {
          setTried(!navigator.onLine);
          if (navigator.onLine) window.location.reload();
        }}
      >
        Try again
      </PrimaryButton>
    </div>
  );
}
