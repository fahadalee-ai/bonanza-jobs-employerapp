import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { TeamRole, ThemeMode } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useGuard, ConfirmDialog, PrimaryButton, SecondaryButton, SelectField, Sheet, TextField, Toggle } from "@/components/ui-app";
import { CompanyMark, EmployerChip, GradientHeader, SettingsRow } from "@/components/employer-ui";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("Recruiter");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [nextPassword, setNextPassword] = useState("");

  if (!user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <GradientHeader title="Settings" subtitle="Employer workspace">
        <div className="mt-4 flex items-center gap-3">
          <CompanyMark letter={user.logoLetter} className="h-12 w-12" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{user.companyName}</p>
              <EmployerChip />
            </div>
            <p className="text-sm text-white/80">{user.fullName}</p>
          </div>
        </div>
      </GradientHeader>
      <div className="space-y-4 px-4 py-4">
        <section className="rounded-[16px] bg-card px-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <SettingsRow to="/company" label="Company Profile" hint="Logo, about, and public preview" />
          <SettingsRow to="/payments" label="Payments / Subscription" hint={user.plan} />
          <SettingsRow to="/notifications" label="Notifications" />
        </section>

        <section className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-heading">Team Members</h2>
            <button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => setInvite(true)}>Invite</button>
          </div>
          {user.team.map((member) => (
            <div key={member.id} className="flex items-center justify-between border-t border-border py-3">
              <div>
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email} · {member.role}</p>
              </div>
              {member.role !== "Admin" && (
                <button type="button" className="text-xs font-semibold text-danger" onClick={() => app.removeMember(member.id)}>Remove</button>
              )}
            </div>
          ))}
        </section>

        <section className="rounded-[16px] bg-card px-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <h2 className="pt-3 font-semibold text-heading">Notification preferences</h2>
          <Toggle checked={user.prefs.applications} onChange={(applications) => app.updateUser({ prefs: { ...user.prefs, applications } })} label="New applications" />
          <Toggle checked={user.prefs.referrals} onChange={(referrals) => app.updateUser({ prefs: { ...user.prefs, referrals } })} label="New referrals" />
          <Toggle checked={user.prefs.interviews} onChange={(interviews) => app.updateUser({ prefs: { ...user.prefs, interviews } })} label="Interview updates" />
          <Toggle checked={user.prefs.payments} onChange={(payments) => app.updateUser({ prefs: { ...user.prefs, payments } })} label="Payments due" />
          <Toggle checked={user.prefs.expiring} onChange={(expiring) => app.updateUser({ prefs: { ...user.prefs, expiring } })} label="Jobs expiring" />
        </section>

        <section className="rounded-[16px] bg-card px-4 py-2 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <h2 className="pt-2 font-semibold text-heading">Security</h2>
          <SettingsRow label="Change password" onClick={() => setPasswordOpen(true)} />
          <Toggle checked={user.twoFactor} onChange={(twoFactor) => app.updateUser({ twoFactor })} label="Two-factor authentication" hint="Text a code when signing in" />
        </section>

        <section className="rounded-[16px] bg-card px-4 py-3 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <h2 className="font-semibold text-heading">Default job settings</h2>
          <SelectField label="Default work mode" value={user.defaultWorkMode} onChange={(event) => app.updateUser({ defaultWorkMode: event.target.value })}>
            {["On-site", "Hybrid", "Remote"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectField>
          <Toggle checked={user.defaultVisible} onChange={(defaultVisible) => app.updateUser({ defaultVisible })} label="Visible to referral agents" />
          <SelectField label="Language" value={user.language} onChange={() => app.pushToast("English (US) is the current language")}>
            <option>English (US)</option>
          </SelectField>
          <p className="mb-2 text-[13px] font-medium">Appearance</p>
          <div className="mb-3 flex gap-2">
            {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
              <button key={mode} type="button" onClick={() => app.setTheme(mode)} className={app.theme === mode ? "h-10 flex-1 rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-sm font-semibold capitalize text-white" : "h-10 flex-1 rounded-full border border-border text-sm font-semibold capitalize"}>
                {mode}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[16px] bg-card px-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
          <SettingsRow to="/help" label="Help" />
          <SettingsRow to="/terms" label="Terms" />
          <SettingsRow to="/privacy" label="Privacy" />
          <SettingsRow to="/session-expired" label="Session expired" hint="Preview the signed-out state" />
        </section>

        <SecondaryButton className="w-full text-danger" onClick={() => setLogoutOpen(true)}>
          Log out
        </SecondaryButton>
      </div>

      <ConfirmDialog open={logoutOpen} title="Log out?" body="You’ll need your work email and password to get back into Northline." confirmLabel="Log out" onClose={() => setLogoutOpen(false)} onConfirm={() => { app.logout(); navigate({ to: "/welcome", replace: true }); }} />

      <Sheet
        open={invite}
        title="Invite teammate"
        onClose={() => setInvite(false)}
        footer={<PrimaryButton className="w-full" onClick={() => { if (!email.includes("@")) return; app.inviteMember(email, role); app.pushToast("Invite sent", email); setEmail(""); setInvite(false); }}>Send invite</PrimaryButton>}
      >
        <TextField label="Work email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" />
        <SelectField label="Role" value={role} onChange={(event) => setRole(event.target.value as TeamRole)}>
          <option>Admin</option>
          <option>Recruiter</option>
          <option>Viewer</option>
        </SelectField>
      </Sheet>

      <Sheet
        open={passwordOpen}
        title="Change password"
        onClose={() => setPasswordOpen(false)}
        footer={<PrimaryButton className="w-full" onClick={() => { if (nextPassword.length < 8) return; app.updateUser({ password: nextPassword }); app.pushToast("Password updated"); setPasswordOpen(false); }}>Save password</PrimaryButton>}
      >
        <TextField label="New password" type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
      </Sheet>
    </div>
  );
}
