import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { COMPANY_SIZES, INDUSTRIES, US_STATES } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useGuard, PageHeader, PrimaryButton, SelectField, Sheet, StickyBar, TextArea, TextField } from "@/components/ui-app";
import { CompanyMark } from "@/components/employer-ui";

export const Route = createFileRoute("/company")({
  component: CompanyProfile,
});

function CompanyProfile() {
  const app = useGuard();
  const user = app.user;
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState(() => ({
    companyName: user?.companyName ?? "",
    description: user?.description ?? "",
    website: user?.website ?? "",
    industry: user?.industry ?? INDUSTRIES[0],
    companySize: user?.companySize ?? COMPANY_SIZES[0],
    founded: user?.founded ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
    state: user?.state || "CO",
    linkedin: user?.linkedin ?? "",
  }));

  useEffect(() => {
    if (!user?.companyName) return;
    setForm((current) => (current.companyName ? current : {
      companyName: user.companyName,
      description: user.description,
      website: user.website,
      industry: user.industry,
      companySize: user.companySize,
      founded: user.founded,
      address: user.address,
      city: user.city,
      state: user.state || "CO",
      linkedin: user.linkedin,
    }));
  }, [user]);

  if (!user) return <div className="min-h-dvh bg-background" />;
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="Company Profile" subtitle="What candidates see" fallback="/settings" right={<button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => setPreview(true)}>Preview</button>} />
      <div className="px-4">
        <div className="mb-4 flex items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] p-4 text-white">
          <CompanyMark letter={user.logoLetter} className="h-14 w-14" />
          <div>
            <p className="font-semibold">Logo and cover</p>
            <p className="text-sm text-white/80">Initials mark stays on brand</p>
          </div>
        </div>
        <TextField label="Company Name" value={form.companyName} onChange={(event) => set("companyName", event.target.value)} />
        <TextArea label="About" value={form.description} onChange={(event) => set("description", event.target.value)} />
        <TextField label="Website" value={form.website} onChange={(event) => set("website", event.target.value)} />
        <SelectField label="Industry" value={form.industry} onChange={(event) => set("industry", event.target.value)}>
          {INDUSTRIES.map((item) => <option key={item}>{item}</option>)}
        </SelectField>
        <SelectField label="Size" value={form.companySize} onChange={(event) => set("companySize", event.target.value)}>
          {COMPANY_SIZES.map((item) => <option key={item}>{item}</option>)}
        </SelectField>
        <TextField label="Founded year" value={form.founded} onChange={(event) => set("founded", event.target.value)} />
        <TextField label="Address" value={form.address} onChange={(event) => set("address", event.target.value)} />
        <div className="grid grid-cols-[1fr_96px] gap-3">
          <TextField label="City" value={form.city} onChange={(event) => set("city", event.target.value)} />
          <SelectField label="State" value={form.state} onChange={(event) => set("state", event.target.value)}>
            {US_STATES.map((item) => <option key={item}>{item}</option>)}
          </SelectField>
        </div>
        <TextField label="LinkedIn" value={form.linkedin} onChange={(event) => set("linkedin", event.target.value)} />
      </div>
      <StickyBar>
        <PrimaryButton className="w-full" onClick={() => { app.updateUser(form); app.pushToast("Company profile saved"); }}>
          Save
        </PrimaryButton>
      </StickyBar>
      <Sheet open={preview} title="Public preview" onClose={() => setPreview(false)}>
        <CompanyMark letter={user.logoLetter} className="mb-3 h-14 w-14" />
        <h2 className="text-xl font-semibold text-heading">{form.companyName}</h2>
        <p className="text-sm text-muted-foreground">{form.industry} · {form.companySize} · Founded {form.founded || "—"}</p>
        <p className="mt-3 text-[15px] leading-6">{form.description || "Add a description so candidates know who you are."}</p>
        <p className="mt-3 text-sm text-[#7A22C8]">{form.website}</p>
        <p className="text-sm text-muted-foreground">{form.address} {form.city}, {form.state}</p>
      </Sheet>
    </div>
  );
}
