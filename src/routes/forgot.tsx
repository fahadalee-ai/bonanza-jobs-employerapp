import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { AuthCanvas, PrimaryButton, SecondaryButton, SuccessMark, TextField } from "@/components/ui-app";

export const Route = createFileRoute("/forgot")({
  component: Forgot,
});

function Forgot() {
  const { requestReset } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [found, setFound] = useState(true);

  const send = () => {
    const ok = requestReset(email);
    setFound(ok);
    setSent(true);
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
      {sent ? (
        <div className="mt-10 rounded-3xl bg-white p-6 text-center shadow-[0_16px_40px_rgba(15,11,42,0.22)]">
          <SuccessMark />
          <h1 className="mt-5 text-2xl font-semibold text-heading">{found ? "Check your inbox" : "Email not found"}</h1>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
            {found ? `We sent a reset link for ${email || "your work email"}.` : "We couldn’t find an employer account with that work email."}
          </p>
          {found && (
            <SecondaryButton className="mt-6 w-full" onClick={() => navigate({ to: "/reset" })}>
              Enter a new password
            </SecondaryButton>
          )}
        </div>
      ) : (
        <>
          <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Forgot password</h1>
          <p className="mt-2 text-[15px] leading-6 text-white/85">We’ll email you a link to choose a new password.</p>
          <form
            className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <TextField label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
            <PrimaryButton className="w-full" onClick={send}>
              Send reset link
            </PrimaryButton>
          </form>
        </>
      )}
    </AuthCanvas>
  );
}
