import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "@/components/ui-app";

export const Route = createFileRoute("/session-expired")({
  component: SessionExpired,
});

function SessionExpired() {
  const { logout } = useApp();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold text-heading">Session expired</h1>
      <p className="mt-2 max-w-[280px] text-[15px] leading-6 text-muted-foreground">
        For your company’s security, sign in again to review candidates and payments.
      </p>
      <PrimaryButton
        className="mt-6 w-full"
        onClick={() => {
          logout();
          navigate({ to: "/login", replace: true });
        }}
      >
        Sign in
      </PrimaryButton>
    </div>
  );
}
