import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { PageHeader, PrimaryButton, SuccessMark } from "@/components/ui-app";

export const Route = createFileRoute("/verify")({
  component: Verify,
});

function Verify() {
  const { pendingSignup, verifyOtp } = useApp();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!pendingSignup && !done) navigate({ to: "/signup", replace: true });
  }, [pendingSignup, done, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const code = digits.join("");

  const submit = () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (!verifyOtp(code)) {
      setError("That code expired. Request a new one.");
      return;
    }
    haptic();
    setDone(true);
    window.setTimeout(() => navigate({ to: "/setup", replace: true }), 900);
  };

  const onChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      const next = clean.slice(0, 6).split("");
      const filled = ["", "", "", "", "", ""];
      next.forEach((digit, offset) => {
        if (index + offset < 6) filled[index + offset] = digit;
      });
      setDigits(filled);
      refs.current[Math.min(5, index + next.length)]?.focus();
      return;
    }
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < 5) refs.current[index + 1]?.focus();
  };

  return (
    <div className="min-h-dvh pb-28">
      <PageHeader brand title="Verify your email" subtitle="We sent a 6-digit code" fallback="/signup" />
      <div className="px-4">
        {done ? (
          <div className="pt-16 text-center">
            <SuccessMark />
            <h2 className="mt-5 text-2xl font-semibold text-heading">You’re verified</h2>
          </div>
        ) : (
          <>
            <p className="mb-5 text-[15px] leading-6 text-muted-foreground">
              Enter the code sent to {pendingSignup?.email || "your work email"}. Any 6 digits work in this preview.
            </p>
            <div className="grid grid-cols-6 gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={6}
                  value={digit}
                  aria-label={`Digit ${index + 1}`}
                  onChange={(event) => onChange(index, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus();
                  }}
                  className="h-14 rounded-xl border border-border bg-card text-center text-xl font-semibold outline-none focus:border-[#7A22C8] focus:ring-4 focus:ring-[#7A22C8]/15"
                />
              ))}
            </div>
            {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
            <div className="mt-5 flex items-center justify-between text-sm">
              <button
                type="button"
                disabled={seconds > 0}
                onClick={() => setSeconds(30)}
                className="font-semibold text-blue disabled:text-muted-foreground"
              >
                {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
              </button>
              <button type="button" onClick={() => navigate({ to: "/signup" })} className="font-semibold text-foreground">
                Change email
              </button>
            </div>
          </>
        )}
      </div>
      {!done && (
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-card px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <PrimaryButton className="w-full" onClick={submit}>
            Verify
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
