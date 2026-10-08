import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { useGuard, Avatar, Chip, EmptyState, PrimaryButton, SecondaryButton, Sheet } from "@/components/ui-app";
import { GradientHeader } from "@/components/employer-ui";

export const Route = createFileRoute("/talent/")({
  component: TalentSearch,
});

function TalentSearch() {
  const app = useGuard();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"Results" | "Shortlisted" | "Saved">("Results");
  const [open, setOpen] = useState(false);
  const [experience, setExperience] = useState("Any");
  const [availability, setAvailability] = useState("Any");
  const [authorization, setAuthorization] = useState("Any");

  const results = useMemo(() => {
    const pool = tab === "Shortlisted" ? app.candidates.filter((item) => app.user?.shortlist.includes(item.id)) : app.candidates;
    return pool.filter((person) => {
      const hay = `${person.name} ${person.headline} ${person.skills.join(" ")} ${person.location}`.toLowerCase();
      const matchesQuery = hay.includes(query.trim().toLowerCase());
      const matchesExp = experience === "Any" || person.experienceYears.startsWith(experience[0] ?? "");
      const matchesAvail = availability === "Any" || person.availability === availability || (availability === "Soon" && person.availability !== "Hired");
      const matchesAuth = authorization === "Any" || person.authorization.toLowerCase().includes(authorization.toLowerCase().slice(0, 6));
      return matchesQuery && (experience === "Any" || matchesExp) && matchesAvail && (authorization === "Any" || matchesAuth);
    });
  }, [app.candidates, app.user, query, tab, experience, availability, authorization]);

  if (!app.user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <GradientHeader title="Talent" subtitle="Search US professionals" />
      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[16px] bg-card px-3 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
            <Search size={18} className="text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Keyword, skill, or title" className="h-12 min-w-0 flex-1 bg-transparent outline-none" />
          </div>
          <button type="button" aria-label="Filters" onClick={() => setOpen(true)} className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-card text-[#7A22C8] shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          {(["Results", "Shortlisted", "Saved"] as const).map((item) => (
            <Chip key={item} active={tab === item} onClick={() => setTab(item)}>
              {item}
            </Chip>
          ))}
        </div>
        {query.trim() && (
          <button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => { app.addSavedSearch(query); app.pushToast("Search saved", query); }}>
            Save this search
          </button>
        )}
        {tab === "Saved" ? (
          app.user.savedSearches.length === 0 ? (
            <EmptyState title="No saved searches" body="Save a keyword search to come back to it." />
          ) : (
            app.user.savedSearches.map((item) => (
              <button key={item.id} type="button" onClick={() => { setQuery(item.query); setTab("Results"); }} className="flex w-full items-center justify-between rounded-[16px] bg-card px-4 py-4 text-left">
                <span className="font-semibold text-heading">{item.label}</span>
                <span className="text-xs font-semibold text-danger" onClick={(event) => { event.stopPropagation(); app.removeSavedSearch(item.id); }}>Remove</span>
              </button>
            ))
          )
        ) : results.length === 0 ? (
          <EmptyState title="No talent results" body="Try a broader skill, city, or availability filter." />
        ) : (
          results.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => navigate({ to: "/talent/$candidateId", params: { candidateId: person.id }, search: { source: "search", jobId: "" } })}
              className="w-full rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)]"
            >
              <div className="flex items-center gap-3">
                <Avatar src={person.photo} name={person.name} className="h-12 w-12 text-sm" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-heading">{person.name}</p>
                  <p className="truncate text-[13px] text-muted-foreground">{person.headline}</p>
                  <p className="text-[12px] text-muted-foreground">{person.location}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {person.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="rounded-full bg-[#F3E8FF] px-2 py-1 text-[11px] font-semibold text-[#6B21A8]">{skill}</span>
                ))}
                <span className="rounded-full bg-[#E0F4FC] px-2 py-1 text-[11px] font-semibold text-[#075F7A]">{person.availability}</span>
              </div>
            </button>
          ))
        )}
      </div>
      <Sheet
        open={open}
        title="Filters"
        onClose={() => setOpen(false)}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <SecondaryButton onClick={() => { setExperience("Any"); setAvailability("Any"); setAuthorization("Any"); }}>Reset</SecondaryButton>
            <PrimaryButton onClick={() => setOpen(false)}>Show results</PrimaryButton>
          </div>
        }
      >
        <Filter label="Experience" value={experience} options={["Any", "3 years", "5 years", "8 years", "10 years"]} onChange={setExperience} />
        <Filter label="Availability" value={availability} options={["Any", "Immediate", "2 weeks", "Soon"]} onChange={setAvailability} />
        <Filter label="Work authorization" value={authorization} options={["Any", "US citizen", "Sponsorship"]} onChange={setAuthorization} />
        <p className="mt-3 text-xs leading-5 text-muted-foreground">Location, salary expectation, and education are included in the keyword search for this preview.</p>
      </Sheet>
    </div>
  );
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[13px] font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <Chip key={item} active={value === item} onClick={() => onChange(item)}>
            {item}
          </Chip>
        ))}
      </div>
    </div>
  );
}
