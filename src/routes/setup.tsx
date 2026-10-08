import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { US_STATES } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useGuard, PrimaryButton, SecondaryButton, TextArea, TextField } from "@/components/ui-app";
import { CompanyMark } from "@/components/employer-ui";

export const Route = createFileRoute("/setup")({
  component: Setup,
});

function Setup() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState(user?.description ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState(user?.city ?? "Denver");
  const [state, setState] = useState(user?.state || "CO");
  const [hiringStates, setHiringStates] = useState<string[]>(user?.hiringStates ?? ["CO"]);
  const [roles, setRoles] = useState(user?.hiringRoles ?? "");
  const [volume, setVolume] = useState(user?.hiringVolume ?? "");

  if (!user) return <div className="min-h-dvh bg-background" />;

  const finish = (skip: boolean) => {
    app.updateUser({
      description: skip ? user.description : description,
      address: skip ? user.address : address,
      city: skip ? user.city : city,
      state: skip ? user.state : state,
      hiringStates: skip ? user.hiringStates : hiringStates,
      hiringRoles: skip ? user.hiringRoles : roles,
      hiringVolume: skip ? user.hiringVolume : volume,
      setupDone: true,
    });
    navigate({ to: "/overview", replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#7A22C8]">Step {step + 1} of 3</p>
        <button type="button" className="text-sm font-semibold text-muted-foreground" onClick={() => finish(true)}>
          Skip
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E6E8F0]">
        <div className="h-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      {step === 0 && (
        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-heading">Company profile</h1>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">Add a logo mark and a short description candidates will see.</p>
          <div className="my-5 flex items-center gap-3">
            <CompanyMark letter={user.logoLetter} className="h-16 w-16 text-lg" />
            <div>
              <p className="font-semibold text-heading">{user.companyName}</p>
              <p className="text-sm text-muted-foreground">Logo uses your company initials</p>
            </div>
          </div>
          <TextArea label="Company description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does your company do?" />
        </div>
      )}

      {step === 1 && (
        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-heading">Where you hire</h1>
          <TextField label="HQ address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="1801 Wewatta St, Suite 400" />
          <div className="grid grid-cols-[1fr_96px] gap-3">
            <TextField label="City" value={city} onChange={(event) => setCity(event.target.value)} />
            <label className="mb-4 block">
              <span className="mb-1.5 block text-[13px] font-medium">State</span>
              <select value={state} onChange={(event) => setState(event.target.value)} className="h-[52px] w-full rounded-xl border border-border bg-card px-3">
                {US_STATES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mb-2 text-[13px] font-medium">States hiring in</p>
          <div className="flex flex-wrap gap-2">
            {US_STATES.map((item) => {
              const on = hiringStates.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setHiringStates((current) => (on ? current.filter((stateName) => stateName !== item) : [...current, item]))}
                  className={on ? "h-9 rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] px-3 text-sm font-semibold text-white" : "h-9 rounded-full border border-border bg-card px-3 text-sm font-semibold"}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-heading">Hiring needs</h1>
          <TextField label="Roles you’re hiring" value={roles} onChange={(event) => setRoles(event.target.value)} placeholder="Software engineers, nurses" />
          <TextField label="Volume" value={volume} onChange={(event) => setVolume(event.target.value)} placeholder="8–12 hires this quarter" />
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
        <SecondaryButton onClick={() => (step === 0 ? finish(true) : setStep((value) => value - 1))}>{step === 0 ? "Skip" : "Back"}</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            if (step < 2) setStep((value) => value + 1);
            else finish(false);
          }}
        >
          {step === 2 ? "Finish" : "Continue"}
        </PrimaryButton>
      </div>
    </div>
  );
}
