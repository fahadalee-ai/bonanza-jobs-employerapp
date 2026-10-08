import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/mock-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { AuthCanvas, PasswordField, PrimaryButton, TextField, Toggle } from "@/components/ui-app";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    provider: search.provider === "apple" || search.provider === "google" ? search.provider : "",
  }),
  component: Login,
});

function Login() {
  const { provider } = Route.useSearch();
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(provider ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(provider ? DEMO_PASSWORD : "");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const submit = () => {
    setBusy(true);
    window.setTimeout(() => {
      const result = login(email || DEMO_EMAIL, password || DEMO_PASSWORD, remember);
      if (!result.ok) login(DEMO_EMAIL, DEMO_PASSWORD, true);
      setBusy(false);
      haptic();
      navigate({ to: "/overview" });
    }, 400);
  };

  return (
    <AuthCanvas>
      <Logo variant="white" height={72} />
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Welcome back</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">
        {provider === "apple" ? "Continue with Apple." : provider === "google" ? "Continue with Google." : "Sign in to your employer account."}
      </p>
      <form
        className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <TextField label="Work Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
        <PasswordField label="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
        <div className="-mt-2 mb-2 flex justify-end">
          <Link to="/forgot" className="text-sm font-semibold text-[#2B1F6E] underline-offset-2 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="mb-2">
          <Toggle checked={remember} onChange={setRemember} label="Remember me" />
        </div>
        <PrimaryButton className="w-full" disabled={busy} onClick={submit}>
          {busy ? "Signing in…" : "Log In"}
        </PrimaryButton>
        <p className="mt-3 text-center text-[13px] leading-5 text-[#4B5563]">
          Sample: {DEMO_EMAIL} · {DEMO_PASSWORD}
        </p>
      </form>
      <div className="mt-6 space-y-3 text-center">
        <button type="button" onClick={() => navigate({ to: "/signup" })} className="w-full text-[15px] font-semibold text-white">
          New here? Create an employer account
        </button>
        <button type="button" className="w-full text-[15px] font-semibold text-white">
          Looking for a job? Switch to Candidate
        </button>
        <p className="text-[13px] leading-5 text-white">
          By continuing you agree to our <Link to="/terms" className="font-semibold underline underline-offset-2">Terms of Service</Link> and{" "}
          <Link to="/privacy" className="font-semibold underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </div>
    </AuthCanvas>
  );
}
