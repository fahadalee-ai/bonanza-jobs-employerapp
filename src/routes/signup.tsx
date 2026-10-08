import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { COMPANY_SIZES, INDUSTRIES } from "@/lib/mock-data";
import { formatPhone, haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { AuthCanvas, PasswordField, PrimaryButton, TextField } from "@/components/ui-app";

export const Route = createFileRoute("/signup")({
  component: SignUp,
});

function SignUp() {
  const { beginSignup } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (busy) return;
    setError("");
    if (password && confirm && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const result = beginSignup({
      companyName: name.trim() || "New Company",
      fullName: name.trim() || "Hiring Manager",
      jobTitle: "Hiring Manager",
      email,
      phone,
      password: password || confirm || "Employer123",
      companySize: COMPANY_SIZES[2] ?? "51–200",
      industry: INDUSTRIES[0] ?? "Healthcare Technology",
      website: "",
    });
    setBusy(false);
    if (!result.ok) {
      setError("An employer account with that work email already exists.");
      return;
    }
    haptic();
    navigate({ to: "/verify", replace: true });
  };

  return (
    <AuthCanvas>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back to login"
          onClick={() => navigate({ to: "/login" })}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white"
        >
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <Logo variant="white" height={48} />
      </div>
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Create your employer account</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">Join Bonanza Jobs as an employer. It’s free.</p>
      <form
        className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <TextField label="Full name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Jordan Hale" />
        <TextField label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@company.com" />
        <TextField
          label="Work phone"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          placeholder="(303) 555-0148"
          onChange={(event) => setPhone(formatPhone(event.target.value))}
        />
        <PasswordField label="Password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="Create a password" />
        <PasswordField label="Confirm password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" placeholder="Repeat password" />
        {error && <p className="-mt-2 mb-3 text-sm font-medium text-danger">{error}</p>}
        <PrimaryButton className="w-full" disabled={busy} onClick={submit}>
          {busy ? "Creating account…" : "Create Account"}
        </PrimaryButton>
        <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
          By creating an account you agree to the <Link to="/terms" className="font-semibold text-[#0FAEE5]">Terms</Link> and{" "}
          <Link to="/privacy" className="font-semibold text-[#0FAEE5]">Privacy Policy</Link>.
        </p>
      </form>
      <button type="button" onClick={() => navigate({ to: "/login" })} className="mt-6 w-full text-center text-sm font-semibold text-white">
        Already have an employer account? Log in
      </button>
    </AuthCanvas>
  );
}
