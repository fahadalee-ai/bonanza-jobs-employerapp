import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/help")({
  component: Help,
});

function Help() {
  return (
    <div className="min-h-dvh bg-background">
      <PageHeader title="Help" fallback="/settings" />
      <div className="space-y-3 px-4 text-[15px] leading-6 text-muted-foreground">
        <p>Post a requisition from Jobs, review direct applicants on the requisition, and accept or reject referrals from the Referrals tab.</p>
        <p>Referral fees are split into two milestones: offer acceptance and 90-day retention. Pay due milestones from Payments.</p>
        <p>For account review questions, email employers@bonanzajobs.com or call (303) 555-0100 on weekdays, 9am–5pm MT.</p>
      </div>
    </div>
  );
}
