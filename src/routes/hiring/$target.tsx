import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { haptic, usd } from "@/lib/format";
import { useApp } from "@/lib/store";
import { ConfirmDialog, PageHeader, PrimaryButton, StickyBar, TextArea, TextField } from "@/components/ui-app";

export const Route = createFileRoute("/hiring/$target")({
  component: HiringStatus,
});

const STEPS = ["Under Review", "Interview", "Offer", "Hired", "Rejected"] as const;

function HiringStatus() {
  const { target } = Route.useParams();
  const app = useApp();
  const navigate = useNavigate();
  const [kind, id] = target.split("-");
  const application = kind === "app" ? app.applications.find((item) => item.id === id) : undefined;
  const referral = kind === "ref" ? app.referrals.find((item) => item.id === id) : undefined;
  const subject = application ?? referral;
  const person = candidateById(subject?.candidateId ?? "");
  const [step, setStep] = useState<(typeof STEPS)[number]>("Under Review");
  const [date, setDate] = useState("Oct 8, 2026");
  const [notes, setNotes] = useState("");
  const [salary, setSalary] = useState("$128,000 / yr");
  const [start, setStart] = useState("Nov 2, 2026");
  const [reason, setReason] = useState("Another finalist was selected.");
  const [confirm, setConfirm] = useState(false);

  if (!app.hydrated) return <div className="min-h-dvh bg-background" />;
  if (!subject || !person) return <div className="min-h-dvh bg-background px-6 pt-16">Record not found.</div>;
  const fee = referral ? referral.milestone1 : 2250;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="Hiring Status" subtitle={person.name} fallback="/referrals" />
      <div className="px-4">
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {STEPS.map((item) => (
            <button key={item} type="button" onClick={() => setStep(item)} className={step === item ? "h-10 shrink-0 rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] px-3 text-sm font-semibold text-white" : "h-10 shrink-0 rounded-full border border-border px-3 text-sm font-semibold"}>
              {item}
            </button>
          ))}
        </div>
        <TextField label="Date" value={date} onChange={(event) => setDate(event.target.value)} />
        <TextArea label="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
        {step === "Offer" || step === "Hired" ? (
          <>
            <TextField label="Offer salary" value={salary} onChange={(event) => setSalary(event.target.value)} />
            <TextField label="Start date" value={start} onChange={(event) => setStart(event.target.value)} />
          </>
        ) : null}
        {step === "Rejected" && <TextField label="Rejection reason" value={reason} onChange={(event) => setReason(event.target.value)} />}
        {step === "Hired" && referral && (
          <p className="rounded-2xl bg-[#E0F4FC] px-3 py-3 text-sm leading-6 text-[#075F7A]">
            Marking {person.name} hired triggers Milestone 1 (Offer Acceptance) for {usd(fee)}. Milestone 2 (90-Day Retention) starts counting from the start date.
          </p>
        )}
      </div>
      <StickyBar>
        <PrimaryButton className="w-full" onClick={() => setConfirm(true)}>
          Update Status
        </PrimaryButton>
      </StickyBar>
      <ConfirmDialog
        open={confirm}
        title={`Move to ${step}?`}
        body={step === "Hired" && referral ? "This records the hire and marks the offer-acceptance fee as due." : "The candidate’s status will update for your team."}
        confirmLabel="Update"
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          const extra = { notes, offerSalary: salary, startDate: start, rejectReason: reason, statusDate: date };
          if (application) app.setApplicationStatus(application.id, step, extra);
          if (referral) app.setReferralStatus(referral.id, step, extra);
          haptic();
          app.pushToast("Status updated", `${person.name} is now ${step}.`);
          setConfirm(false);
          navigate({ to: referral ? "/referrals/$referralId" : "/jobs/$jobId", params: referral ? { referralId: referral.id } : { jobId: application?.jobId ?? "" } });
        }}
      />
    </div>
  );
}
