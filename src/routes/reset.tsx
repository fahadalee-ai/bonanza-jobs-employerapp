import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { AuthCanvas, PasswordField, PrimaryButton, SuccessMark } from "@/components/ui-app";

export const Route = createFileRoute("/reset")({
  component: Reset,
});

function Reset() {
  const { resetPassword, pushToast } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    resetPassword(password || confirm || "Employer123");
    pushToast("Password updated", "Sign in with your new password.");
    setDone(true);
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
      {done ? (
        <div className="mt-10 rounded-3xl bg-white p-6 text-center shadow-[0_16px_40px_rgba(15,11,42,0.22)]">
          <SuccessMark />
          <h1 className="mt-5 text-2xl font-semibold text-heading">Password updated</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">You can sign in with your new password.</p>
          <PrimaryButton className="mt-6 w-full" onClick={() => navigate({ to: "/login" })}>
            Back to Login
          </PrimaryButton>
        </div>
      ) : (
        <>
          <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">New password</h1>
          <p className="mt-2 text-[15px] leading-6 text-white/85">Choose a password for your employer account.</p>
          <form
            className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <PasswordField label="New password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" />
            <PasswordField label="Confirm password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Repeat password" />
            <PrimaryButton className="w-full" onClick={submit}>
              Update password
            </PrimaryButton>
          </form>
        </>
      )}
    </AuthCanvas>
  );
}
