import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard, PageHeader, PrimaryButton, SelectField, StickyBar, TextArea, TextField } from "@/components/ui-app";

export const Route = createFileRoute("/interview/$target")({
  component: RequestInterview,
});

function parseTarget(target: string) {
  const [kind, id] = target.split("-");
  if ((kind === "app" || kind === "ref" || kind === "talent") && id) return { kind, id };
  return null;
}

function RequestInterview() {
  const { target } = Route.useParams();
  const app = useGuard();
  const navigate = useNavigate();
  const parsed = parseTarget(target);
  const application = parsed?.kind === "app" ? app.applications.find((item) => item.id === parsed.id) : undefined;
  const referral = parsed?.kind === "ref" ? app.referrals.find((item) => item.id === parsed.id) : undefined;
  const candidateId = application?.candidateId ?? referral?.candidateId ?? (parsed?.kind === "talent" ? parsed.id : "");
  const person = candidateById(candidateId);
  const [jobId, setJobId] = useState(application?.jobId ?? referral?.jobId ?? app.jobs.find((job) => job.status === "Active")?.id ?? "");
  const [type, setType] = useState("Video");
  const [date, setDate] = useState("Thu, Oct 9");
  const [time, setTime] = useState("10:30 AM");
  const [duration, setDuration] = useState("45 min");
  const [place, setPlace] = useState("https://meet.northline.io/interview");
  const [notes, setNotes] = useState("");

  if (!app.hydrated || !app.user) return <div className="min-h-dvh bg-background" />;
  if (!person) return <div className="min-h-dvh bg-background px-6 pt-16">Candidate not found.</div>;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="Request Interview" subtitle={person.name} fallback="/overview" />
      <div className="px-4">
        {!application && !referral && (
          <SelectField label="Requisition" value={jobId} onChange={(event) => setJobId(event.target.value)}>
            {app.jobs.filter((job) => job.status === "Active" || job.status === "Paused").map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </SelectField>
        )}
        <SelectField label="Interview type" value={type} onChange={(event) => setType(event.target.value)}>
          {["Phone", "Video", "On-site"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectField>
        <TextField label="Date" value={date} onChange={(event) => setDate(event.target.value)} />
        <p className="mb-2 text-[13px] font-medium">Time</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"].map((slot) => (
            <button key={slot} type="button" onClick={() => setTime(slot)} className={slot === time ? "h-10 rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] px-3 text-sm font-semibold text-white" : "h-10 rounded-full border border-border px-3 text-sm font-semibold"}>
              {slot}
            </button>
          ))}
        </div>
        <SelectField label="Duration" value={duration} onChange={(event) => setDuration(event.target.value)}>
          {["30 min", "45 min", "60 min"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectField>
        <TextField label={type === "On-site" ? "Address" : "Meeting link"} value={place} onChange={(event) => setPlace(event.target.value)} />
        <TextArea label="Notes to candidate" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What should they prepare?" />
      </div>
      <StickyBar>
        <PrimaryButton
          className="w-full"
          onClick={() => {
            const resolvedJobId = application?.jobId ?? referral?.jobId ?? jobId;
            if (!resolvedJobId) {
              app.pushToast("Choose a requisition");
              return;
            }
            app.scheduleInterview({ jobId: resolvedJobId, candidateId: person.id, type, date, time, duration, place, notes });
            haptic();
            app.pushToast("Invite sent", `${person.name} is now in Interview.`);
            navigate({ to: "/jobs/$jobId", params: { jobId: resolvedJobId } });
          }}
        >
          Send Invite
        </PrimaryButton>
      </StickyBar>
    </div>
  );
}
