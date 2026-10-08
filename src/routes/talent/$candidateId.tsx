import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard, Avatar, PrimaryButton, SecondaryButton, Sheet, StickyBar, TextArea } from "@/components/ui-app";
import { GradientHeader } from "@/components/employer-ui";

export const Route = createFileRoute("/talent/$candidateId")({
  validateSearch: (search: Record<string, unknown>) => ({
    source: search.source === "direct" || search.source === "referred" ? search.source : "search",
    jobId: typeof search.jobId === "string" ? search.jobId : "",
  }),
  component: CandidateProfile,
});

function CandidateProfile() {
  const { candidateId } = Route.useParams();
  const { source, jobId } = Route.useSearch();
  const app = useGuard();
  const navigate = useNavigate();
  const person = candidateById(candidateId);
  const [notes, setNotes] = useState(app.user?.notes[candidateId] ?? "");
  useEffect(() => {
    const stored = app.user?.notes[candidateId];
    if (stored) setNotes((current) => current || stored);
  }, [app.user, candidateId]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const job = app.jobs.find((item) => item.id === jobId);
  const application = app.applications.find((item) => item.candidateId === candidateId && item.jobId === jobId);
  const shortlisted = Boolean(app.user?.shortlist.includes(candidateId));

  if (!app.hydrated || !app.user) return <div className="min-h-dvh bg-background" />;
  if (!person) return <div className="min-h-dvh bg-background px-6 pt-16 text-center">Candidate not found.</div>;

  const target = application ? `app-${application.id}` : `talent-${person.id}`;

  return (
    <div className="min-h-dvh bg-background pb-44">
      <GradientHeader back fallback={source === "referred" ? "/referrals" : "/talent"} title={person.name} subtitle={person.headline}>
        <div className="mt-3 flex items-center gap-3">
          <Avatar src={person.photo} name={person.name} className="h-16 w-16 text-lg ring-2 ring-white/40" />
          <div>
            <p className="text-sm text-white/85">{person.location}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">{person.availability}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">{source === "search" ? "Talent search" : source === "direct" ? "Direct" : "Referred"}</span>
            </div>
          </div>
        </div>
      </GradientHeader>
      <div className="space-y-3 px-4 py-4">
        {job && <p className="text-sm text-muted-foreground">For {job.title}</p>}
        <Section title="Summary" body={person.summary} />
        <Section title="Skills" body={person.skills.join(" · ")} />
        <Section title="Experience" lines={person.experience.map((item) => `${item.role}, ${item.company} (${item.dates}) — ${item.body}`)} />
        <Section title="Education" lines={person.education.map((item) => `${item.degree}, ${item.school} · ${item.year}`)} />
        <Section title="Certifications" body={person.certifications.join(", ") || "None listed"} />
        <Section title="Preferences" body={`${person.preferences} Expects ${person.salary}. ${person.authorization}.`} />
        <section className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <h2 className="font-semibold text-heading">Resume</h2>
          <p className="mt-1 text-sm text-muted-foreground">{person.name.replace(" ", "_")}_Resume.pdf</p>
          <SecondaryButton className="mt-3 w-full" onClick={() => navigate({ to: "/talent/$candidateId/resume", params: { candidateId } })}>
            View Resume
          </SecondaryButton>
        </section>
        <section className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <h2 className="font-semibold text-heading">Employer notes</h2>
          <p className="mb-2 text-xs text-muted-foreground">Private to your company</p>
          <TextArea label="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
          <SecondaryButton
            className="w-full"
            onClick={() => {
              app.updateNotes(candidateId, notes);
              app.pushToast("Notes saved");
            }}
          >
            Save notes
          </SecondaryButton>
        </section>
      </div>
      <StickyBar>
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/interview/$target", params: { target } })}>
          Request Interview
        </PrimaryButton>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <SecondaryButton
            onClick={() => {
              if (application) {
                app.setApplicationStatus(application.id, "Shortlisted");
              } else {
                app.toggleShortlist(person.id);
              }
              haptic();
              app.pushToast(shortlisted && !application ? "Removed from shortlist" : "Shortlisted", person.name);
            }}
          >
            Shortlist
          </SecondaryButton>
          <SecondaryButton className="text-danger" onClick={() => setRejectOpen(true)}>
            Reject
          </SecondaryButton>
        </div>
      </StickyBar>
      <Sheet
        open={rejectOpen}
        title="Reject candidate"
        onClose={() => setRejectOpen(false)}
        footer={
          <PrimaryButton
            className="w-full"
            onClick={() => {
              if (application) app.setApplicationStatus(application.id, "Rejected", { rejectReason: "Not moving forward." });
              haptic();
              app.pushToast("Candidate rejected", person.name);
              setRejectOpen(false);
            }}
          >
            Confirm reject
          </PrimaryButton>
        }
      >
        <p className="text-sm leading-6 text-muted-foreground">They will move to Rejected on this requisition. This does not email them in the preview.</p>
      </Sheet>
    </div>
  );
}

function Section({ title, body, lines }: { title: string; body?: string; lines?: string[] }) {
  return (
    <section className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
      <h2 className="font-semibold text-heading">{title}</h2>
      {body && <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{body}</p>}
      {lines && (
        <ul className="mt-2 space-y-2 text-[15px] leading-6 text-muted-foreground">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
