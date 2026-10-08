import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EMPTY_DRAFT } from "@/lib/mock-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard } from "@/components/ui-app";
import { JobWizard } from "@/components/job-wizard";

export const Route = createFileRoute("/jobs/new")({
  component: NewJob,
});

function NewJob() {
  const app = useGuard();
  const navigate = useNavigate();
  if (!app.user) return <div className="min-h-dvh bg-background" />;

  return (
    <JobWizard
      mode="create"
      initial={{ ...EMPTY_DRAFT, workMode: app.user.defaultWorkMode, visibleToAgents: app.user.defaultVisible }}
      onSubmit={(draft, intent) => {
        if (intent === "publish" && (!draft.title.trim() || !draft.description.trim())) {
          app.pushToast("Add a title and description", "Finish the required sections before publishing.");
          return;
        }
        const id = app.saveJob(draft, intent);
        haptic();
        if (intent === "draft") {
          app.pushToast("Draft saved", draft.title || "Untitled requisition");
          navigate({ to: "/jobs" });
          return;
        }
        navigate({ to: "/jobs/$jobId/published", params: { jobId: id } });
      }}
    />
  );
}
