import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { PageHeader, PrimaryButton, SecondaryButton, StickyBar } from "@/components/ui-app";

export const Route = createFileRoute("/talent/$candidateId/resume")({
  component: Resume,
});

function Resume() {
  const { candidateId } = Route.useParams();
  const { pushToast, applications } = useApp();
  const navigate = useNavigate();
  const person = candidateById(candidateId);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const application = applications.find((item) => item.candidateId === candidateId);

  if (!person) return <div className="min-h-dvh bg-background px-6 pt-16">Resume unavailable.</div>;

  const pages = [
    {
      title: "Experience",
      body: person.experience.map((item) => `${item.role}\n${item.company} · ${item.dates}\n${item.body}`).join("\n\n"),
    },
    {
      title: "Education & skills",
      body: `${person.education.map((item) => `${item.degree}, ${item.school} (${item.year})`).join("\n")}\n\n${person.skills.join(" · ")}\n\n${person.summary}`,
    },
  ];

  return (
    <div className="min-h-dvh bg-[#E7E9F2] pb-28 dark:bg-background">
      <PageHeader
        title="Resume"
        subtitle={`${page + 1} of ${pages.length}`}
        fallback="/talent"
        right={
          <button
            type="button"
            aria-label="Share resume"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card"
            onClick={() => pushToast("Share sheet opened", `${person.name} resume`)}
          >
            <Share2 size={18} />
          </button>
        }
      />
      <div className="mb-3 flex items-center justify-center gap-3">
        <button type="button" aria-label="Zoom out" className="flex h-11 w-11 items-center justify-center rounded-full bg-card" onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))}>
          <Minus size={16} />
        </button>
        <span className="text-sm font-semibold">{Math.round(zoom * 100)}%</span>
        <button type="button" aria-label="Zoom in" className="flex h-11 w-11 items-center justify-center rounded-full bg-card" onClick={() => setZoom((value) => Math.min(1.6, value + 0.1))}>
          <Plus size={16} />
        </button>
      </div>
      <div className="px-4">
        <article className="origin-top rounded-[16px] bg-white p-5 text-[#1B1B2F] shadow-[0_4px_16px_rgba(27,27,47,0.08)]" style={{ transform: `scale(${zoom})` }}>
          <p className="text-xl font-semibold">{person.name}</p>
          <p className="text-sm text-[#6B7280]">{person.headline} · {person.location}</p>
          <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-[#7A22C8]">{pages[page]?.title}</h2>
          <p className="mt-2 whitespace-pre-wrap text-[14px] leading-6">{pages[page]?.body}</p>
        </article>
        <div className="mt-4 flex justify-center gap-2">
          {pages.map((item, index) => (
            <button key={item.title} type="button" onClick={() => setPage(index)} className={index === page ? "h-2 w-6 rounded-full bg-[#7A22C8]" : "h-2 w-2 rounded-full bg-[#D1D5DB]"} />
          ))}
        </div>
        <button type="button" className="mt-4 w-full text-sm font-semibold text-[#7A22C8]" onClick={() => pushToast("Download started", `${person.name.replace(" ", "_")}_Resume.pdf`)}>
          Download PDF
        </button>
      </div>
      <StickyBar>
        <div className="grid grid-cols-2 gap-2">
          <PrimaryButton onClick={() => navigate({ to: "/interview/$target", params: { target: application ? `app-${application.id}` : `talent-${person.id}` } })}>
            Request Interview
          </PrimaryButton>
          <SecondaryButton onClick={() => pushToast("Shortlisted", person.name)}>Shortlist</SecondaryButton>
        </div>
      </StickyBar>
    </div>
  );
}
