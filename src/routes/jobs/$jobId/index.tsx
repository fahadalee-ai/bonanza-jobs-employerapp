import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { candidateById, type JobStatus } from "@/lib/mock-data";
import { haptic, payLabel, usd } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard, Avatar, Chip, ConfirmDialog, EmptyState, Sheet, StatusBadge } from "@/components/ui-app";
import { GradientHeader } from "@/components/employer-ui";

export const Route = createFileRoute("/jobs/$jobId/")({
  component: RequisitionDetails,
});

const TABS = ["Overview", "Direct Applications", "Referred Talent", "Activity"] as const;

function RequisitionDetails() {
  const { jobId } = Route.useParams();
  const app = useGuard();
  const navigate = useNavigate();
  const job = app.jobs.find((item) => item.id === jobId);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [statusFilter, setStatusFilter] = useState("All");
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState<"Close" | "Delete" | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  if (!app.hydrated || !app.user) return <div className="min-h-dvh bg-background" />;
  if (!job) {
    return <div className="min-h-dvh bg-background px-6 pt-16 text-center text-muted-foreground">Requisition not found.</div>;
  }

  const applications = app.applications.filter((item) => item.jobId === job.id);
  const referrals = app.referrals.filter((item) => item.jobId === job.id);
  const interviews = app.interviews.filter((item) => item.jobId === job.id);
  const offers = applications.filter((item) => item.status === "Offer" || item.status === "Hired").length + referrals.filter((item) => item.status === "Offer" || item.status === "Hired").length;
  const visibleApps = applications.filter((item) => statusFilter === "All" || item.status === statusFilter);
  const half = Math.round(job.referralFee / 2);

  const act = (status: JobStatus, title: string) => {
    app.setJobStatus(job.id, status);
    haptic();
    app.pushToast(title, job.title);
    setMenu(false);
  };

  return (
    <div className="min-h-dvh bg-background pb-28">
      <GradientHeader
        back
        fallback="/jobs"
        title={job.title}
        subtitle={`${job.city}, ${job.state} · Posted ${job.posted}`}
        right={
          <button type="button" aria-label="Actions" onClick={() => setMenu(true)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <MoreHorizontal />
          </button>
        }
      >
        <div className="mt-3">
          <StatusBadge status={job.status} />
        </div>
      </GradientHeader>

      <div className="grid grid-cols-4 gap-2 px-4 py-4 text-center">
        {[
          ["Applicants", applications.length],
          ["Referrals", referrals.length],
          ["Interviews", interviews.length],
          ["Offers", offers],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[16px] bg-card px-1 py-3 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
            <p className="text-lg font-bold text-heading">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {TABS.map((item) => (
          <Chip key={item} active={tab === item} onClick={() => setTab(item)}>
            {item === "Direct Applications" ? "Applications" : item === "Referred Talent" ? "Referred" : item}
          </Chip>
        ))}
      </div>

      <div className="space-y-3 px-4 py-4">
        {tab === "Overview" && (
          <>
            <Block title="Description" body={job.description} />
            <Block title="Responsibilities" lines={job.responsibilities} />
            <Block title="Requirements" lines={[...job.skills, job.experience, job.education, job.authorization].filter(Boolean)} />
            <Block title="Compensation" body={`${payLabel(job.salaryMin, job.salaryMax, job.payType)}${job.bonus ? " · Bonus eligible" : ""}`} />
            <Block
              title="Referral fee"
              body={
                job.feeIsPercent
                  ? `${job.referralFee}% split across offer acceptance and 90-day retention`
                  : `${usd(job.referralFee)} · Offer Acceptance ${usd(half)} · 90-Day Retention ${usd(job.referralFee - half)}`
              }
            />
            <Block title="Deadline" body={job.deadline || "No deadline"} />
          </>
        )}

        {tab === "Direct Applications" && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["All", "New", "Shortlisted", "Interview", "Rejected", "Hired"].map((item) => (
                  <Chip key={item} active={statusFilter === item} onClick={() => setStatusFilter(item)}>
                    {item}
                  </Chip>
                ))}
              </div>
            </div>
            <button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => { setSelecting((value) => !value); setPicked([]); }}>
              {selecting ? "Cancel select" : "Select"}
            </button>
            {visibleApps.length === 0 ? (
              <EmptyState title="No applications" body="Candidates who apply directly will show up here." />
            ) : (
              visibleApps.map((item) => {
                const person = candidateById(item.candidateId);
                if (!person) return null;
                return (
                  <article key={item.id} className="rounded-[16px] bg-card p-3 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 text-left"
                      onClick={() => {
                        if (selecting) {
                          setPicked((current) => (current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]));
                          return;
                        }
                        navigate({ to: "/talent/$candidateId", params: { candidateId: person.id }, search: { source: "direct", jobId: job.id } });
                      }}
                    >
                      {selecting && <span className={`h-5 w-5 rounded border ${picked.includes(item.id) ? "bg-[#7A22C8]" : "border-border"}`} />}
                      <Avatar src={person.photo} name={person.name} className="h-12 w-12 text-sm" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-heading">{person.name}</span>
                          <StatusBadge status={item.status} />
                        </span>
                        <span className="block truncate text-[13px] text-muted-foreground">{person.headline}</span>
                        <span className="block text-[12px] text-muted-foreground">
                          {person.location} · {person.experienceYears} · {person.match}% match · {item.applied}
                        </span>
                      </span>
                    </button>
                    {!selecting && item.status !== "Hired" && item.status !== "Rejected" && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Mini label="Shortlist" onClick={() => { app.setApplicationStatus(item.id, "Shortlisted"); haptic(); app.pushToast("Shortlisted", person.name); }} />
                        <Mini label="Reject" onClick={() => { app.setApplicationStatus(item.id, "Rejected", { rejectReason: "Not moving forward." }); haptic(); app.pushToast("Application rejected", person.name); }} />
                        <Mini label="Interview" onClick={() => navigate({ to: "/interview/$target", params: { target: `app-${item.id}` } })} />
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </>
        )}

        {tab === "Referred Talent" && (
          referrals.length === 0 ? (
            <EmptyState title="No referrals" body="Referral agents haven’t submitted candidates for this job yet." />
          ) : (
            referrals.map((item) => {
              const person = candidateById(item.candidateId);
              if (!person) return null;
              return (
                <button key={item.id} type="button" onClick={() => navigate({ to: "/referrals/$referralId", params: { referralId: item.id } })} className="w-full rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-heading">{person.name}</p>
                      <p className="text-[13px] text-muted-foreground">{item.agentName} · {item.agentRating.toFixed(1)} ★</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{item.recommendation}</p>
                  <p className="mt-2 text-[12px] text-muted-foreground">Submitted {item.submitted}</p>
                </button>
              );
            })
          )
        )}

        {tab === "Activity" && (
          <ol className="space-y-3">
            {app.activity.filter((item) => item.jobId === job.id).map((item) => (
              <li key={item.id} className="rounded-[16px] bg-card px-4 py-3 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                <p className="text-sm font-medium text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      {selecting && picked.length > 0 && (
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-2">
            <Mini label={`Shortlist ${picked.length}`} onClick={() => { app.bulkApplicationStatus(picked, "Shortlisted"); haptic(); app.pushToast("Candidates shortlisted"); setPicked([]); setSelecting(false); }} />
            <Mini label={`Reject ${picked.length}`} onClick={() => { app.bulkApplicationStatus(picked, "Rejected"); haptic(); app.pushToast("Applications rejected"); setPicked([]); setSelecting(false); }} />
          </div>
        </div>
      )}

      <Sheet open={menu} title="Requisition actions" onClose={() => setMenu(false)}>
        <div className="space-y-1">
          <Mini label="Edit" onClick={() => navigate({ to: "/jobs/$jobId/edit", params: { jobId: job.id } })} />
          <Mini label="Duplicate" onClick={() => { const id = app.duplicateJob(job.id); app.pushToast("Draft created"); navigate({ to: "/jobs/$jobId/edit", params: { jobId: id } }); }} />
          {job.status === "Paused" ? <Mini label="Activate" onClick={() => act("Active", "Job activated")} /> : job.status !== "Closed" && <Mini label="Pause" onClick={() => act("Paused", "Job paused")} />}
          {job.status !== "Closed" && <Mini label="Close" onClick={() => setConfirm("Close")} />}
          <Mini label="Delete" onClick={() => setConfirm("Delete")} />
        </div>
      </Sheet>
      <ConfirmDialog open={confirm === "Close"} title="Close this requisition?" body="Candidates can no longer apply. Existing applications stay available for review." confirmLabel="Close job" onClose={() => setConfirm(null)} onConfirm={() => { act("Closed", "Job closed"); setConfirm(null); }} />
      <ConfirmDialog open={confirm === "Delete"} danger title="Delete this requisition?" body="This removes the job, its applications, and its referrals from your workspace." confirmLabel="Delete" onClose={() => setConfirm(null)} onConfirm={() => { app.deleteJob(job.id); haptic(); app.pushToast("Job deleted"); navigate({ to: "/jobs" }); }} />
    </div>
  );
}

function Block({ title, body, lines }: { title: string; body?: string; lines?: string[] }) {
  return (
    <section className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
      <h2 className="text-base font-semibold text-heading">{title}</h2>
      {body && <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{body}</p>}
      {lines && (
        <ul className="mt-2 space-y-1 text-[15px] leading-6 text-muted-foreground">
          {lines.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Mini({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-11 w-full items-center justify-center rounded-xl border border-border text-[13px] font-semibold text-[#7A22C8]">
      {label}
    </button>
  );
}
