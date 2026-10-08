import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useGuard, Chip, EmptyState, PrimaryButton, Sheet, StatusBadge } from "@/components/ui-app";
import { GradientHeader, Stars } from "@/components/employer-ui";

export const Route = createFileRoute("/referrals/")({
  component: Referrals,
});

function Referrals() {
  const app = useGuard();
  const navigate = useNavigate();
  const [status, setStatus] = useState("All");
  const [agent, setAgent] = useState("All");
  const [open, setOpen] = useState(false);
  const agents = ["All", ...new Set(app.referrals.map((item) => item.agentName))];

  const list = useMemo(
    () => app.referrals.filter((item) => (status === "All" || item.status === status) && (agent === "All" || item.agentName === agent)),
    [app.referrals, status, agent],
  );

  if (!app.user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <GradientHeader
        title="Referrals"
        subtitle="Referred talent"
        right={
          <button type="button" aria-label="Filters" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <SlidersHorizontal size={18} />
          </button>
        }
      />
      <div className="space-y-3 px-4 py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Submitted", "Under Review", "Interview", "Hired", "Rejected"].map((item) => (
            <Chip key={item} active={status === item} onClick={() => setStatus(item)}>
              {item}
            </Chip>
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyState title="No referrals" body="When agents submit candidates, they will appear here for review." />
        ) : (
          list.map((item) => {
            const person = candidateById(item.candidateId);
            const job = app.jobs.find((jobItem) => jobItem.id === item.jobId);
            if (!person) return null;
            return (
              <button key={item.id} type="button" onClick={() => navigate({ to: "/referrals/$referralId", params: { referralId: item.id } })} className="w-full rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-heading">{person.name}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{item.agentName}</p>
                    <Stars value={item.agentRating} />
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 text-[13px] font-medium text-foreground">{job?.title}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{item.recommendation}</p>
                <p className="mt-2 text-[12px] text-muted-foreground">Submitted {item.submitted}</p>
              </button>
            );
          })
        )}
      </div>
      <Sheet open={open} title="Filter referrals" onClose={() => setOpen(false)} footer={<PrimaryButton className="w-full" onClick={() => setOpen(false)}>Apply</PrimaryButton>}>
        <p className="mb-2 text-[13px] font-medium">Agent</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {agents.map((item) => (
            <Chip key={item} active={agent === item} onClick={() => setAgent(item)}>
              {item}
            </Chip>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Date filter uses the submitted date shown on each card.</p>
      </Sheet>
    </div>
  );
}
