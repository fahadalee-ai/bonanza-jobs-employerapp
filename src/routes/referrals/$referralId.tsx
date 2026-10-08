import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { haptic, usd } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard, Avatar, PrimaryButton, SecondaryButton, Sheet, StickyBar } from "@/components/ui-app";
import { GradientHeader, Stars } from "@/components/employer-ui";

export const Route = createFileRoute("/referrals/$referralId")({
  component: ReferralReview,
});

function ReferralReview() {
  const { referralId } = Route.useParams();
  const app = useGuard();
  const navigate = useNavigate();
  const referral = app.referrals.find((item) => item.id === referralId);
  const person = candidateById(referral?.candidateId ?? "");
  const job = app.jobs.find((item) => item.id === referral?.jobId);
  const [reason, setReason] = useState("Skills don’t match the requisition.");
  const [open, setOpen] = useState(false);

  if (!app.hydrated || !app.user) return <div className="min-h-dvh bg-background" />;
  if (!referral || !person || !job) return <div className="min-h-dvh bg-background px-6 pt-16">Referral not found.</div>;

  return (
    <div className="min-h-dvh bg-background pb-44">
      <GradientHeader back fallback="/referrals" title={person.name} subtitle={person.headline}>
        <div className="mt-3 flex items-center gap-3">
          <Avatar src={person.photo} name={person.name} className="h-14 w-14" />
          <div>
            <p className="text-sm text-white/80">{person.location}</p>
            <button type="button" className="mt-1 text-sm font-semibold underline" onClick={() => navigate({ to: "/talent/$candidateId", params: { candidateId: person.id }, search: { source: "referred", jobId: job.id } })}>
              View full profile
            </button>
          </div>
        </div>
      </GradientHeader>
      <div className="space-y-3 px-4 py-4">
        <section className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7A22C8]">Agent recommendation</p>
          <p className="mt-2 font-semibold text-heading">{referral.agentName}</p>
          <Stars value={referral.agentRating} />
          <p className="text-[13px] text-muted-foreground">{referral.agentPlacement}</p>
          <p className="mt-3 text-[15px] leading-6 text-foreground">{referral.recommendation}</p>
        </section>
        <section className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Job</p>
          <p className="mt-1 font-semibold text-heading">{job.title}</p>
          <p className="text-sm text-muted-foreground">{job.city}, {job.state} · {job.department}</p>
          <SecondaryButton className="mt-3 w-full" onClick={() => navigate({ to: "/talent/$candidateId/resume", params: { candidateId: person.id } })}>
            View Resume
          </SecondaryButton>
        </section>
        <section className="rounded-[16px] border border-[#F5B301]/40 bg-[#FFF8E6] p-4 dark:bg-[#F5B301]/10">
          <p className="font-semibold text-[#92400E] dark:text-[#F5D98A]">If hired</p>
          <p className="mt-1 text-sm leading-6 text-[#92400E] dark:text-[#F5D98A]">
            Milestone 1 (Offer Acceptance) {usd(referral.milestone1)}
            <br />
            Milestone 2 (90-Day Retention) {usd(referral.milestone2)}
          </p>
        </section>
      </div>
      <StickyBar>
        <div className="grid grid-cols-3 gap-2">
          <PrimaryButton
            onClick={() => {
              app.setReferralStatus(referral.id, "Accepted");
              haptic();
              app.pushToast("Referral accepted", person.name);
            }}
          >
            Accept
          </PrimaryButton>
          <SecondaryButton onClick={() => setOpen(true)}>Reject</SecondaryButton>
          <SecondaryButton onClick={() => navigate({ to: "/interview/$target", params: { target: `ref-${referral.id}` } })}>Interview</SecondaryButton>
        </div>
        <button type="button" className="mt-2 w-full text-sm font-semibold text-[#7A22C8]" onClick={() => navigate({ to: "/hiring/$target", params: { target: `ref-${referral.id}` } })}>
          Update hiring status
        </button>
      </StickyBar>
      <Sheet
        open={open}
        title="Reject referral"
        onClose={() => setOpen(false)}
        footer={
          <PrimaryButton
            className="w-full"
            onClick={() => {
              app.setReferralStatus(referral.id, "Rejected", { rejectReason: reason });
              haptic();
              app.pushToast("Referral rejected", person.name);
              setOpen(false);
            }}
          >
            Confirm reject
          </PrimaryButton>
        }
      >
        {["Skills don’t match the requisition.", "Role is on hold.", "Candidate declined.", "Another finalist was selected."].map((item) => (
          <button key={item} type="button" onClick={() => setReason(item)} className={`mb-2 flex min-h-12 w-full items-center rounded-xl border px-3 text-left text-sm ${reason === item ? "border-[#7A22C8] bg-[#F3E8FF]" : "border-border"}`}>
            {item}
          </button>
        ))}
      </Sheet>
    </div>
  );
}
