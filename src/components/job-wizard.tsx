import { useState } from "react";
import { SKILL_SUGGESTIONS, US_STATES, type JobDraft, type JobStatus } from "@/lib/mock-data";
import { usd } from "@/lib/format";
import { Chip, PrimaryButton, SecondaryButton, SelectField, StickyBar, TextArea, TextField, Toggle } from "@/components/ui-app";
import { PageHeader } from "@/components/ui-app";

const STEPS = ["Basics", "Description", "Requirements", "Compensation", "Referral Fee", "Review"];

export function JobWizard({
  initial,
  mode,
  status,
  lastEdited,
  hasApplications,
  onSubmit,
}: {
  initial: JobDraft;
  mode: "create" | "edit";
  status?: JobStatus;
  lastEdited?: string;
  hasApplications?: boolean;
  onSubmit: (draft: JobDraft, intent: "draft" | "publish" | "save") => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<JobDraft>(initial);
  const [skill, setSkill] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  const patch = (partial: Partial<JobDraft>) => setDraft((current) => ({ ...current, ...partial }));
  const fee = Number(draft.referralFee) || 0;
  const half = Math.round(fee / 2);

  const validate = () => {
    if (step === 0 && (!draft.title.trim() || !draft.department.trim() || !draft.city.trim() || !draft.state)) {
      return "Add a title, department, and location.";
    }
    if (step === 1 && draft.description.trim().length < 20) return "Add a description of at least a sentence.";
    if (step === 2 && draft.skills.length === 0) return "Add at least one skill.";
    if (step === 3) {
      const min = Number(draft.salaryMin);
      const max = Number(draft.salaryMax);
      if (!min || !max || min > max) return "Enter a valid salary range.";
    }
    if (step === 4 && fee <= 0) return "Enter a referral fee.";
    return "";
  };

  const next = () => {
    const message = validate();
    setError(message);
    if (!message) setStep((value) => Math.min(STEPS.length - 1, value + 1));
  };

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader
        title={mode === "create" ? "Post New Job" : "Edit Job"}
        subtitle={mode === "edit" ? `${status ?? "Draft"} · Edited ${lastEdited}` : `Step ${step + 1} of ${STEPS.length}`}
        fallback="/jobs"
      />
      <div className="px-4">
        <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[#E6E8F0] dark:bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="mb-4 text-[13px] font-semibold text-[#7A22C8]">{STEPS[step]}</p>
        {hasApplications && mode === "edit" && (
          <p className="mb-4 rounded-2xl bg-[#FEF3C7] px-3 py-3 text-[13px] leading-5 text-[#92400E]">
            This job has active applications. Saving changes updates what candidates and agents still see.
          </p>
        )}

        {step === 0 && (
          <>
            <TextField label="Job Title" value={draft.title} onChange={(event) => patch({ title: event.target.value })} placeholder="Software Engineer" />
            <TextField label="Department" value={draft.department} onChange={(event) => patch({ department: event.target.value })} placeholder="Engineering" />
            <SelectField label="Employment Type" value={draft.employmentType} onChange={(event) => patch({ employmentType: event.target.value })}>
              {["Full-time", "Part-time", "Contract", "Temporary"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectField>
            <SelectField label="Work Mode" value={draft.workMode} onChange={(event) => patch({ workMode: event.target.value })}>
              {["On-site", "Hybrid", "Remote"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectField>
            <div className="grid grid-cols-[1fr_96px] gap-3">
              <TextField label="City" value={draft.city} onChange={(event) => patch({ city: event.target.value })} placeholder="Denver" />
              <SelectField label="State" value={draft.state} onChange={(event) => patch({ state: event.target.value })}>
                {US_STATES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </SelectField>
            </div>
            <TextField label="Number of Openings" type="number" min={1} value={draft.openings} onChange={(event) => patch({ openings: Number(event.target.value) || 1 })} />
          </>
        )}

        {step === 1 && (
          <>
            <TextArea label="Description" value={draft.description} onChange={(event) => patch({ description: event.target.value })} placeholder="What will this person own?" />
            <TextArea label="Responsibilities" value={draft.responsibilities} onChange={(event) => patch({ responsibilities: event.target.value })} placeholder={"One responsibility per line"} />
            <TextArea label="Benefits" value={draft.benefits} onChange={(event) => patch({ benefits: event.target.value })} placeholder={"One benefit per line"} />
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-2 text-[13px] font-medium">Skills</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {draft.skills.map((item) => (
                <Chip key={item} active onClick={() => patch({ skills: draft.skills.filter((skillName) => skillName !== item) })}>
                  {item} ×
                </Chip>
              ))}
            </div>
            <div className="mb-3 flex gap-2">
              <input
                value={skill}
                onChange={(event) => setSkill(event.target.value)}
                placeholder="Add a skill"
                className="h-[52px] min-w-0 flex-1 rounded-xl border border-border bg-card px-3.5 outline-none focus:border-[#7A22C8] focus:ring-4 focus:ring-[#7A22C8]/15"
              />
              <SecondaryButton
                className="px-4"
                onClick={() => {
                  const next = skill.trim();
                  if (!next || draft.skills.includes(next)) return;
                  patch({ skills: [...draft.skills, next] });
                  setSkill("");
                }}
              >
                Add
              </SecondaryButton>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.filter((item) => !draft.skills.includes(item)).map((item) => (
                <Chip key={item} onClick={() => patch({ skills: [...draft.skills, item] })}>
                  {item}
                </Chip>
              ))}
            </div>
            <SelectField label="Experience Level" value={draft.experience} onChange={(event) => patch({ experience: event.target.value })}>
              {["Entry", "Mid", "Senior", "Lead", "Executive"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectField>
            <SelectField label="Education" value={draft.education} onChange={(event) => patch({ education: event.target.value })}>
              {["High school", "Associate", "Bachelor's degree", "Master's", "Doctorate", "None specified"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectField>
            <TextField label="Certifications" value={draft.certifications} onChange={(event) => patch({ certifications: event.target.value })} placeholder="RN license, BLS" />
            <SelectField label="Work Authorization" value={draft.authorization} onChange={(event) => patch({ authorization: event.target.value })}>
              {["US work authorization required", "US citizen or permanent resident", "Visa sponsorship available", "Any"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectField>
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Minimum" inputMode="numeric" value={draft.salaryMin} onChange={(event) => patch({ salaryMin: event.target.value.replace(/[^\d.]/g, "") })} />
              <TextField label="Maximum" inputMode="numeric" value={draft.salaryMax} onChange={(event) => patch({ salaryMax: event.target.value.replace(/[^\d.]/g, "") })} />
            </div>
            <SelectField label="Pay Type" value={draft.payType} onChange={(event) => patch({ payType: event.target.value as JobDraft["payType"] })}>
              <option value="annual">Annual</option>
              <option value="hourly">Hourly</option>
            </SelectField>
            <Toggle checked={draft.bonus} onChange={(bonus) => patch({ bonus })} label="Bonus or commission" hint="Show a bonus note on the requisition" />
          </>
        )}

        {step === 4 && (
          <>
            <TextField
              label={draft.feeIsPercent ? "Referral fee (%)" : "Referral fee (USD)"}
              inputMode="numeric"
              value={draft.referralFee}
              onChange={(event) => patch({ referralFee: event.target.value.replace(/[^\d.]/g, "") })}
            />
            <Toggle checked={draft.feeIsPercent} onChange={(feeIsPercent) => patch({ feeIsPercent })} label="Use a percentage" hint="Otherwise the fee is a flat USD amount" />
            <div className="mb-4 rounded-[16px] bg-[#F6F7FB] p-4 text-sm dark:bg-white/5">
              <p className="font-semibold text-heading">Milestone split</p>
              {draft.feeIsPercent ? (
                <p className="mt-1 text-muted-foreground">Offer Acceptance {half || 0}% · 90-Day Retention {fee - half || 0}%</p>
              ) : (
                <p className="mt-1 text-muted-foreground">
                  Offer Acceptance {usd(half)} · 90-Day Retention {usd(fee - half)}
                </p>
              )}
            </div>
            <Toggle checked={draft.visibleToAgents} onChange={(visibleToAgents) => patch({ visibleToAgents })} label="Visible to Referral Agents" />
            <TextField label="Application deadline" value={draft.deadline} onChange={(event) => patch({ deadline: event.target.value })} placeholder="Oct 31, 2026" />
            <p className="mb-2 text-[13px] font-medium">Screening questions</p>
            <div className="mb-3 space-y-2">
              {draft.questions.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => patch({ questions: draft.questions.filter((_, itemIndex) => itemIndex !== index) })}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-3 text-left text-sm"
                >
                  <span>{item}</span>
                  <span className="text-muted-foreground">Remove</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Add a question"
                className="h-[52px] min-w-0 flex-1 rounded-xl border border-border bg-card px-3.5 outline-none focus:border-[#7A22C8]"
              />
              <SecondaryButton
                className="px-4"
                onClick={() => {
                  if (!question.trim()) return;
                  patch({ questions: [...draft.questions, question.trim()] });
                  setQuestion("");
                }}
              >
                Add
              </SecondaryButton>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="space-y-3">
            {[
              ["Basics", `${draft.title} · ${draft.department} · ${draft.city}, ${draft.state}`, 0],
              ["Description", draft.description || "Not added", 1],
              ["Requirements", draft.skills.join(", ") || "No skills", 2],
              ["Compensation", `${draft.salaryMin}–${draft.salaryMax} ${draft.payType}`, 3],
              ["Referral fee", draft.feeIsPercent ? `${draft.referralFee}%` : usd(fee), 4],
            ].map(([label, body, index]) => (
              <div key={String(label)} className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-heading">{label}</p>
                  <button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => setStep(Number(index))}>
                    Edit
                  </button>
                </div>
                <p className="mt-1 line-clamp-3 text-sm leading-5 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
      </div>

      <StickyBar>
        {mode === "edit" ? (
          <PrimaryButton className="w-full" onClick={() => onSubmit(draft, "save")}>
            Save Changes
          </PrimaryButton>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <SecondaryButton onClick={() => onSubmit(draft, "draft")}>Save Draft</SecondaryButton>
            {step < 5 ? (
              <PrimaryButton onClick={next}>Continue</PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => onSubmit(draft, "publish")}>Publish Job</PrimaryButton>
            )}
          </div>
        )}
        {mode === "create" && step > 0 && step < 5 && (
          <button type="button" className="mt-2 w-full text-sm font-semibold text-muted-foreground" onClick={() => setStep((value) => value - 1)}>
            Back
          </button>
        )}
        {mode === "edit" && step < 5 && (
          <button type="button" className="mt-2 w-full text-sm font-semibold text-[#7A22C8]" onClick={next}>
            Review next section
          </button>
        )}
      </StickyBar>
    </div>
  );
}
