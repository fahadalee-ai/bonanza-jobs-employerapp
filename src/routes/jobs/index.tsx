import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { JobStatus, Requisition } from "@/lib/mock-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard, Chip, ConfirmDialog, EmptyState, Sheet, StatusBadge } from "@/components/ui-app";
import { GradientHeader } from "@/components/employer-ui";

export const Route = createFileRoute("/jobs/")({
  component: Jobs,
});

const FILTERS = ["All", "Active", "Paused", "Draft", "Closed"] as const;

function Jobs() {
  const app = useGuard();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [menu, setMenu] = useState<Requisition | null>(null);
  const [confirm, setConfirm] = useState<"Close" | "Delete" | null>(null);

  const jobs = useMemo(() => {
    return app.jobs.filter((job) => {
      const matchesFilter = filter === "All" || job.status === filter;
      const hay = `${job.title} ${job.department} ${job.city}`.toLowerCase();
      return matchesFilter && hay.includes(query.trim().toLowerCase());
    });
  }, [app.jobs, filter, query]);

  if (!app.user) return <div className="min-h-dvh bg-background" />;

  const act = (status: JobStatus, title: string) => {
    if (!menu) return;
    app.setJobStatus(menu.id, status);
    haptic();
    app.pushToast(title, menu.title);
    setMenu(null);
  };

  return (
    <div className="min-h-dvh bg-background pb-32">
      <GradientHeader title="Jobs" subtitle="Active requisitions" />
      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center gap-2 rounded-[16px] bg-card px-3 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <Search size={18} className="text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requisitions" className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((item) => (
            <Chip key={item} active={filter === item} onClick={() => setFilter(item)}>
              {item}
            </Chip>
          ))}
        </div>
        {jobs.length === 0 ? (
          <EmptyState icon={<Search size={28} />} title="No requisitions" body="Try another filter, or post a new job." />
        ) : (
          jobs.map((job) => {
            const applicants = app.applications.filter((item) => item.jobId === job.id).length;
            const referrals = app.referrals.filter((item) => item.jobId === job.id).length;
            const interviews = app.interviews.filter((item) => item.jobId === job.id).length;
            return (
              <article key={job.id} className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                <button type="button" className="w-full text-left" onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[16px] font-semibold text-heading">{job.title}</h2>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {job.department} · {job.city}, {job.state}
                      </p>
                      <p className="text-[12px] text-muted-foreground">Posted {job.posted}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Applicants", applicants],
                      ["Referrals", referrals],
                      ["Interviews", interviews],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-xl bg-[#F6F7FB] px-2 py-2 dark:bg-white/5">
                        <p className="text-base font-bold text-heading">{value}</p>
                        <p className="text-[11px] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </button>
                <div className="mt-2 flex justify-end">
                  <button type="button" aria-label="Job actions" className="flex h-11 w-11 items-center justify-center" onClick={() => setMenu(job)}>
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
      <button
        type="button"
        onClick={() => navigate({ to: "/jobs/new" })}
        className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-[max(1rem,calc(50vw-179px))] z-30 flex h-14 items-center gap-2 rounded-full bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] px-4 text-sm font-semibold text-white shadow-lg"
      >
        <Plus size={18} /> Post New Job
      </button>

      <Sheet open={Boolean(menu)} title={menu?.title ?? "Job"} onClose={() => setMenu(null)}>
        <div className="space-y-1">
          <Action label="View" onClick={() => menu && navigate({ to: "/jobs/$jobId", params: { jobId: menu.id } })} />
          <Action label="Edit" onClick={() => menu && navigate({ to: "/jobs/$jobId/edit", params: { jobId: menu.id } })} />
          <Action
            label="Duplicate"
            onClick={() => {
              if (!menu) return;
              const id = app.duplicateJob(menu.id);
              app.pushToast("Job duplicated", "Saved as a draft.");
              haptic();
              setMenu(null);
              navigate({ to: "/jobs/$jobId/edit", params: { jobId: id } });
            }}
          />
          {menu?.status === "Paused" ? (
            <Action label="Activate" onClick={() => act("Active", "Job activated")} />
          ) : (
            menu?.status !== "Closed" && <Action label="Pause" onClick={() => act("Paused", "Job paused")} />
          )}
          {menu?.status !== "Closed" && (
            <Action label="Close" onClick={() => setConfirm("Close")} />
          )}
          <Action label="Delete" danger onClick={() => setConfirm("Delete")} />
        </div>
      </Sheet>
      <ConfirmDialog
        open={confirm === "Close"}
        title="Close this requisition?"
        body="Candidates can no longer apply. Existing applications stay available for review."
        confirmLabel="Close job"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          act("Closed", "Job closed");
          setConfirm(null);
        }}
      />
      <ConfirmDialog
        open={confirm === "Delete"}
        danger
        title="Delete this requisition?"
        body="This removes the job, its applications, and its referrals from your workspace."
        confirmLabel="Delete"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (!menu) return;
          app.deleteJob(menu.id);
          haptic();
          app.pushToast("Job deleted", menu.title);
          setConfirm(null);
          setMenu(null);
        }}
      />
    </div>
  );
}

function Action({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-12 w-full items-center text-left text-[15px] font-medium ${danger ? "text-danger" : "text-foreground"}`}>
      {label}
    </button>
  );
}
