import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { draftFromJob } from "@/lib/mock-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard } from "@/components/ui-app";
import { JobWizard } from "@/components/job-wizard";

export const Route = createFileRoute("/jobs/$jobId/edit")({
  component: EditJob,
});

function EditJob() {
  const { jobId } = Route.useParams();
  const app = useGuard();
  const navigate = useNavigate();
  const job = app.jobs.find((item) => item.id === jobId);
  if (!app.hydrated || !app.user) return <div className="min-h-dvh bg-background" />;
  if (!job) return <div className="min-h-dvh bg-background px-6 pt-16 text-center text-muted-foreground">Requisition not found.</div>;
  const hasApplications = app.applications.some((item) => item.jobId === job.id) || app.referrals.some((item) => item.jobId === job.id);

  return (
    <JobWizard
      mode="edit"
      initial={draftFromJob(job)}
      status={job.status}
      lastEdited={job.lastEdited}
      hasApplications={hasApplications}
      onSubmit={(draft) => {
        app.saveJob(draft, "save", job.id);
        haptic();
        app.pushToast("Changes saved", job.title);
        navigate({ to: "/jobs/$jobId", params: { jobId: job.id } });
      }}
    />
  );
}
