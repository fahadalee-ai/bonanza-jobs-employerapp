import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-dvh bg-background">
      <PageHeader title="Privacy" fallback="/settings" />
      <div className="space-y-3 px-4 pb-8 text-[15px] leading-6 text-muted-foreground">
        <p>Employer notes stay private to your company. Candidate profiles are shown so you can evaluate applications and referrals.</p>
        <p>This preview keeps your workspace in local storage on this device. Clearing site data removes the session.</p>
      </div>
    </div>
  );
}
