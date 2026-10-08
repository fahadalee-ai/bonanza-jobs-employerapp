import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { PrimaryButton, SecondaryButton, SuccessMark } from "@/components/ui-app";

export const Route = createFileRoute("/jobs/$jobId/published")({
  component: Published,
});

function Published() {
  const { jobId } = Route.useParams();
  const { jobs, pushToast } = useApp();
  const navigate = useNavigate();
  const job = jobs.find((item) => item.id === jobId);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <SuccessMark />
      <h1 className="mt-5 text-2xl font-semibold text-heading">Job Published</h1>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
        {job ? `${job.title} is live for candidates${job.visibleToAgents ? " and referral agents" : ""}.` : "Your requisition is live."}
      </p>
      <div className="mt-8 w-full space-y-3">
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId } })}>
          View Requisition
        </PrimaryButton>
        <SecondaryButton
          className="w-full"
          onClick={async () => {
            const url = `https://jobs.bonanzajobs.com/r/${jobId}`;
            haptic();
            if (navigator.share) {
              await navigator.share({ title: job?.title ?? "Job", url }).catch(() => undefined);
            } else if (navigator.clipboard) {
              await navigator.clipboard.writeText(url);
            }
            pushToast("Share link ready", url);
          }}
        >
          Share Job
        </SecondaryButton>
      </div>
    </div>
  );
}
