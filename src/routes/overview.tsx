import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Briefcase, CalendarClock, ChevronRight, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { greeting, haptic, usd } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard, Avatar, Card, EmptyState, SectionTitle, Skeleton, StatusBadge } from "@/components/ui-app";
import { BellButton, CompanyMark, EmployerChip, Funnel, Sparkline } from "@/components/employer-ui";

export const Route = createFileRoute("/overview")({
  component: Overview,
});

function Overview() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  const [loading, setLoading] = useState(true);
  const [pull, setPull] = useState(0);
  const [startY, setStartY] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!user) return <div className="min-h-dvh bg-background" />;

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      app.pushToast("Overview updated");
    }, 600);
  };

  const unread = app.notifications.filter((item) => !item.read).length;
  const activeJobs = app.jobs.filter((job) => job.status === "Active").length;
  const reviewed =
    app.applications.filter((item) => item.status !== "New").length +
    app.referrals.filter((item) => item.status !== "Submitted").length;
  const interviewCount =
    app.applications.filter((item) => item.status === "Interview").length +
    app.referrals.filter((item) => item.status === "Interview").length;
  const hires =
    app.applications.filter((item) => item.status === "Hired").length +
    app.referrals.filter((item) => ["Hired", "90-Day Retention", "Referral Fee Earned", "Paid"].includes(item.status)).length;
  const fees = app.referrals.reduce(
    (sum, item) => sum + (item.m1Status === "Due" ? item.milestone1 : 0) + (item.m2Status === "Due" ? item.milestone2 : 0),
    0,
  );
  const applied = app.applications.length + app.referrals.length;
  const funnelReviewed = reviewed;
  const offer =
    app.applications.filter((item) => item.status === "Offer" || item.status === "Hired").length +
    app.referrals.filter((item) => ["Offer", "Hired", "90-Day Retention", "Referral Fee Earned", "Paid"].includes(item.status)).length;
  const newApps = app.applications.filter((item) => item.status === "New");
  const waiting = app.referrals.filter((item) => item.status === "Submitted" || item.status === "Under Review");
  const today = app.interviews.filter((item) => item.today);
  const recentApps = [...app.applications].slice(0, 3);
  const recentRefs = [...app.referrals].slice(0, 3);

  const kpis = [
    { label: "Active Jobs", value: String(activeJobs) },
    { label: "Applications", value: String(app.applications.length) },
    { label: "Referrals", value: String(app.referrals.length) },
    { label: "Candidates Reviewed", value: String(reviewed) },
    { label: "Interviews", value: String(interviewCount) },
    { label: "Hires", value: String(hires) },
  ];

  return (
    <div
      className="bg-background pb-28"
      onTouchStart={(event) => setStartY(event.touches[0]?.clientY ?? null)}
      onTouchMove={(event) => {
        if (startY == null || window.scrollY > 0) return;
        setPull(Math.max(0, Math.min(80, (event.touches[0]?.clientY ?? startY) - startY)));
      }}
      onTouchEnd={() => {
        if (pull > 64) refresh();
        setPull(0);
        setStartY(null);
      }}
    >
      <header className="relative overflow-hidden bg-gradient-to-br from-[#5B1496] via-[#7A22C8] to-[#8E4AD4] px-4 pb-16 pt-[max(0.7rem,env(safe-area-inset-top))] text-white">
        <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <CompanyMark letter={user.logoLetter} className="h-11 w-11 text-sm" />
          <BellButton count={unread} onClick={() => navigate({ to: "/notifications" })} />
        </div>
        <p className="relative mt-4 text-[13px] text-white/80">{greeting()}</p>
        <div className="relative mt-1 flex items-center gap-2">
          <h1 className="truncate text-[22px] font-semibold leading-7">{user.companyName}</h1>
          <EmployerChip />
        </div>
        <p className="relative mt-1 text-sm text-white/80">
          {user.fullName} · {user.jobTitle}
        </p>
      </header>

      <div className="relative z-10 -mt-8 space-y-5 px-4">
        {pull > 20 && <p className="text-center text-xs font-semibold text-[#7A22C8]">Release to refresh</p>}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Post New Job", icon: Plus, to: "/jobs/new" },
            { label: "Search Talent", icon: Search, to: "/talent" },
            { label: "Review Referrals", icon: Users, to: "/referrals" },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                haptic();
                navigate({ to: action.to as "/" });
              }}
              className="flex min-h-[76px] flex-col items-start justify-between rounded-[16px] bg-card p-3 text-left shadow-[0_8px_24px_rgba(27,27,47,0.08)]"
            >
              <action.icon size={18} className="text-[#7A22C8]" />
              <span className="text-[12px] font-semibold leading-4 text-heading">{action.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
            <Skeleton className="col-span-2 h-40" />
          </div>
        ) : app.jobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No requisitions yet"
            body="Post your first job to start receiving applications and referrals."
            action={
              <button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => navigate({ to: "/jobs/new" })}>
                Post New Job
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {kpis.map((item) => (
                <Card key={item.label} className="p-3.5">
                  <p className="text-[28px] font-bold leading-8 text-heading">{item.value}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{item.label}</p>
                </Card>
              ))}
              <Card className="border border-[#F5B301]/40 bg-[#FFF8E6] p-3.5 dark:bg-[#F5B301]/10">
                <p className="text-[22px] font-bold leading-7 text-[#92400E] dark:text-[#F5D98A]">{usd(fees)}</p>
                <p className="mt-1 text-[12px] font-medium text-[#92400E] dark:text-[#F5D98A]">Referral Fees Owed</p>
              </Card>
              <Card className="p-3.5">
                <p className="text-[12px] text-muted-foreground">Referral Performance</p>
                <div className="mt-2">
                  <Sparkline points={[2, 3, 2, 5, 4, 6, 4]} />
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle>Hiring Funnel</SectionTitle>
              <Funnel
                steps={[
                  { label: "Applied", value: applied },
                  { label: "Reviewed", value: funnelReviewed },
                  { label: "Interview", value: interviewCount + today.length },
                  { label: "Offer", value: offer },
                  { label: "Hired", value: hires },
                ]}
              />
            </Card>

            <section>
              <SectionTitle>Needs Attention</SectionTitle>
              <div className="space-y-2">
                {newApps.length > 0 && (
                  <Attention title={`${newApps.length} new application${newApps.length === 1 ? "" : "s"}`} body="Waiting for a first review" onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: newApps[0].jobId } })} />
                )}
                {waiting.length > 0 && (
                  <Attention title={`${waiting.length} referral${waiting.length === 1 ? "" : "s"} awaiting review`} body="Agents are waiting on a decision" onClick={() => navigate({ to: "/referrals" })} />
                )}
                {today.map((item) => {
                  const person = candidateById(item.candidateId);
                  return (
                    <Attention key={item.id} title={`Interview today · ${item.time}`} body={`${person?.name ?? "Candidate"} · ${item.type}`} onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: item.jobId } })} />
                  );
                })}
                {fees > 0 && <Attention title="Payment due" body={`${usd(fees)} in referral milestones`} onClick={() => navigate({ to: "/payments" })} />}
              </div>
            </section>

            <section>
              <SectionTitle action={<button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => navigate({ to: "/jobs" })}>See jobs</button>}>
                Recent Applications
              </SectionTitle>
              <div className="space-y-2">
                {recentApps.map((item) => {
                  const person = candidateById(item.candidateId);
                  const job = app.jobs.find((jobItem) => jobItem.id === item.jobId);
                  if (!person) return null;
                  return (
                    <button key={item.id} type="button" onClick={() => navigate({ to: "/talent/$candidateId", params: { candidateId: person.id }, search: { source: "direct", jobId: item.jobId } })} className="flex w-full items-center gap-3 rounded-[16px] bg-card p-3 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                      <Avatar src={person.photo} name={person.name} className="h-11 w-11 text-sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-heading">{person.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{job?.title} · {item.applied}</span>
                      </span>
                      <StatusBadge status={item.status} />
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <SectionTitle action={<button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => navigate({ to: "/referrals" })}>See all</button>}>
                Recent Referrals
              </SectionTitle>
              <div className="space-y-2">
                {recentRefs.map((item) => {
                  const person = candidateById(item.candidateId);
                  const job = app.jobs.find((jobItem) => jobItem.id === item.jobId);
                  if (!person) return null;
                  return (
                    <button key={item.id} type="button" onClick={() => navigate({ to: "/referrals/$referralId", params: { referralId: item.id } })} className="flex w-full items-center gap-3 rounded-[16px] bg-card p-3 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                      <Avatar src={person.photo} name={person.name} className="h-11 w-11 text-sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-heading">{person.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{job?.title} · {item.agentName}</span>
                      </span>
                      <StatusBadge status={item.status} />
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <SectionTitle>Upcoming Interviews</SectionTitle>
              <div className="space-y-2">
                {app.interviews.map((item) => {
                  const person = candidateById(item.candidateId);
                  return (
                    <Card key={item.id} className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3E8FF] text-[#7A22C8]">
                        <CalendarClock size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-heading">{person?.name}</span>
                        <span className="mt-1 inline-flex rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[11px] font-semibold text-[#6B21A8]">
                          {item.date} · {item.time}
                        </span>
                      </span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </Card>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Attention({ title, body, onClick }: { title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-[16px] bg-card px-3 py-3 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#7A22C8]" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-heading">{title}</span>
        <span className="block text-xs text-muted-foreground">{body}</span>
      </span>
      <ChevronRight size={16} className="text-muted-foreground" />
    </button>
  );
}
