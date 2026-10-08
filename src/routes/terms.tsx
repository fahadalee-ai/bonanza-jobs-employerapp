import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/terms")({
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-dvh bg-background">
      <PageHeader title="Terms" fallback="/settings" />
      <div className="space-y-3 px-4 pb-8 text-[15px] leading-6 text-muted-foreground">
        <p>Bonanza Jobs provides hiring tools for US employers. You are responsible for the accuracy of requisitions and for decisions you make about candidates.</p>
        <p>Referral fees are owed only after the milestones in your requisition are met. Subscription fees renew on the date shown in Payments unless you cancel before renewal.</p>
        <p>This preview uses sample data stored on your device. It is not a contract.</p>
      </div>
    </div>
  );
}
