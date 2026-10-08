import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ONBOARDING } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "@/components/ui-app";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { markOnboarded } = useApp();
  const slide = ONBOARDING[index] ?? ONBOARDING[0];
  const last = index === ONBOARDING.length - 1;

  const finish = () => {
    markOnboarded();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0F0B2A]">
      <img key={slide.image} src={slide.image} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#0B0820] via-[#0B0820]/88 to-transparent" />
      <button
        type="button"
        onClick={finish}
        className="absolute right-4 top-[max(0.85rem,env(safe-area-inset-top))] z-10 rounded-full bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md"
      >
        Skip
      </button>
      <div className="relative z-10 flex min-h-dvh flex-col justify-end px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <h1 className="max-w-[18rem] text-[28px] font-semibold leading-8 text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          {slide.title}
        </h1>
        <p className="mt-3 max-w-[20rem] text-[16px] leading-6 text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
          {slide.body}
        </p>
        <div className="mb-5 mt-8 flex justify-center gap-2">
          {ONBOARDING.map((item, dot) => (
            <span
              key={item.title}
              className={dot === index ? "h-2 w-6 rounded-full bg-white" : "h-2 w-2 rounded-full bg-white/40"}
            />
          ))}
        </div>
        <PrimaryButton
          className="w-full"
          onClick={() => {
            if (last) finish();
            else setIndex((value) => value + 1);
          }}
        >
          {last ? "Get Started" : "Next"}
        </PrimaryButton>
      </div>
    </div>
  );
}
