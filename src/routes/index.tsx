import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Bonanza Jobs" }],
  }),
  component: Splash,
});

function Splash() {
  const { hydrated, user, onboarded } = useApp();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!hydrated || leaving) return;
    const timer = window.setTimeout(() => {
      setLeaving(true);
      if (user) navigate({ to: user.setupDone ? "/overview" : "/setup", replace: true });
      else if (onboarded) navigate({ to: "/login", replace: true });
      else navigate({ to: "/onboarding", replace: true });
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [hydrated, navigate, leaving, user, onboarded]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#7A22C8] via-[#4A28C9] to-[#0FAEE5] px-6">
      <div className="pointer-events-none absolute -left-20 -top-10 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-[#7EE7FF]/30 blur-3xl" />
      <div className="animate-[splash-pop_0.8s_ease] text-center">
        <div className="relative mx-auto w-fit overflow-hidden">
          <Logo variant="white" height={156} className="drop-shadow-[0_16px_36px_rgba(15,11,42,0.35)]" />
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#B8F3FF]/80 to-transparent mix-blend-screen animate-[splash-shimmer_1.5s_ease_0.2s_1]" />
        </div>
        <p className="mt-6 text-sm font-medium tracking-wide text-white">Hire Smarter. Hire Faster.</p>
      </div>
      <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-10 right-10 h-1 overflow-hidden rounded-full bg-white/25">
        <div className="h-full w-full origin-left bg-white animate-[bar-fill_2s_linear_forwards]" />
      </div>
    </div>
  );
}
