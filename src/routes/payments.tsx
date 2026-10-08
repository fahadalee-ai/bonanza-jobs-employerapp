import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { candidateById } from "@/lib/mock-data";
import { haptic, usd } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useGuard, PageHeader, PrimaryButton, SecondaryButton, Sheet, StatusBadge, StickyBar, TextField } from "@/components/ui-app";

export const Route = createFileRoute("/payments")({
  component: Payments,
});

function Payments() {
  const app = useGuard();
  const user = app.user;
  const [methodOpen, setMethodOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [kind, setKind] = useState<"card" | "ach">("card");
  const [label, setLabel] = useState("Visa");
  const [detail, setDetail] = useState("");
  const [selected, setSelected] = useState(user?.methods[0]?.id ?? "");

  if (!user) return <div className="min-h-dvh bg-background" />;

  const owed = app.referrals.filter((item) => item.m1Status === "Due" || item.m2Status === "Due" || item.status === "Hired" || item.m1Status === "Paid");
  const dueTotal = app.referrals.reduce((sum, item) => sum + (item.m1Status === "Due" ? item.milestone1 : 0) + (item.m2Status === "Due" ? item.milestone2 : 0), 0);

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="Payments" subtitle="Plan and referral fees" fallback="/settings" />
      <div className="space-y-3 px-4">
        <section className="rounded-[16px] bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] p-4 text-white">
          <p className="text-sm text-white/80">Current plan</p>
          <p className="mt-1 text-2xl font-semibold">{user.plan}</p>
          <p className="mt-1 text-sm text-white/85">Renews {user.renewal}</p>
          <button type="button" className="mt-3 h-11 rounded-[14px] bg-white px-4 text-sm font-semibold text-[#7A22C8]" onClick={() => app.pushToast("Upgrade request sent", "A specialist will follow up.")}>
            Upgrade
          </button>
        </section>

        <h2 className="pt-2 text-lg font-semibold text-heading">Referral Fees Owed</h2>
        {owed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No referral fees yet.</p>
        ) : (
          owed.map((item) => {
            const person = candidateById(item.candidateId);
            return (
              <article key={item.id} className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
                <p className="font-semibold text-heading">{person?.name}</p>
                <p className="text-sm text-muted-foreground">Agent {item.agentName}</p>
                <div className="mt-3 space-y-2">
                  <FeeRow label="Milestone 1 · Offer Acceptance" amount={item.milestone1} status={item.m1Status === "Due" ? "Due" : item.m1Status} />
                  <FeeRow label="Milestone 2 · 90-Day Retention" amount={item.milestone2} status={item.m2Status} extra={item.m2Due ? `Due ${item.m2Due}` : undefined} />
                </div>
              </article>
            );
          })
        )}

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-lg font-semibold text-heading">Payment methods</h2>
          <button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => setAddOpen(true)}>Add</button>
        </div>
        {user.methods.map((method) => (
          <div key={method.id} className="flex items-center justify-between rounded-[16px] bg-card px-4 py-3">
            <button type="button" className="text-left" onClick={() => setSelected(method.id)}>
              <p className="font-semibold">{method.label} {selected === method.id ? "· Selected" : ""}</p>
              <p className="text-sm text-muted-foreground">{method.kind === "ach" ? "ACH" : "Card"} {method.detail}</p>
            </button>
            <button type="button" className="text-xs font-semibold text-danger" onClick={() => app.removePaymentMethod(method.id)}>Remove</button>
          </div>
        ))}

        <h2 className="pt-2 text-lg font-semibold text-heading">Billing history</h2>
        {user.invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between rounded-[16px] bg-card px-4 py-3">
            <div>
              <p className="font-semibold">{invoice.label}</p>
              <p className="text-xs text-muted-foreground">{invoice.date}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{usd(invoice.amount)}</p>
              <button type="button" className="text-xs font-semibold text-[#7A22C8]" onClick={() => app.pushToast("Invoice downloaded", `${invoice.label}.pdf`)}>
                <StatusBadge status={invoice.status} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
      <StickyBar>
        <PrimaryButton
          className="w-full"
          disabled={dueTotal === 0}
          onClick={() => setMethodOpen(true)}
        >
          Pay Now {dueTotal ? usd(dueTotal) : ""}
        </PrimaryButton>
      </StickyBar>
      <Sheet
        open={methodOpen}
        title="Pay referral fees"
        onClose={() => setMethodOpen(false)}
        footer={
          <PrimaryButton
            className="w-full"
            onClick={() => {
              const paid = app.payDueFees();
              haptic();
              app.pushToast(paid ? "Payment sent" : "Nothing due", paid ? usd(paid) : undefined);
              setMethodOpen(false);
            }}
          >
            Confirm payment
          </PrimaryButton>
        }
      >
        {user.methods.map((method) => (
          <button key={method.id} type="button" onClick={() => setSelected(method.id)} className={`mb-2 flex min-h-12 w-full items-center rounded-xl border px-3 text-left ${selected === method.id ? "border-[#7A22C8]" : "border-border"}`}>
            {method.label} {method.detail}
          </button>
        ))}
      </Sheet>
      <Sheet
        open={addOpen}
        title="Add payment method"
        onClose={() => setAddOpen(false)}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <SecondaryButton onClick={() => setAddOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => { app.addPaymentMethod(kind, label, detail || "•••• 4242"); app.pushToast("Payment method added"); setAddOpen(false); }}>Save</PrimaryButton>
          </div>
        }
      >
        <div className="mb-3 flex gap-2">
          <button type="button" className={kind === "card" ? "h-10 flex-1 rounded-full bg-[#7A22C8] text-sm font-semibold text-white" : "h-10 flex-1 rounded-full border text-sm font-semibold"} onClick={() => setKind("card")}>Card</button>
          <button type="button" className={kind === "ach" ? "h-10 flex-1 rounded-full bg-[#7A22C8] text-sm font-semibold text-white" : "h-10 flex-1 rounded-full border text-sm font-semibold"} onClick={() => setKind("ach")}>ACH</button>
        </div>
        <TextField label="Name" value={label} onChange={(event) => setLabel(event.target.value)} />
        <TextField label={kind === "card" ? "Card number" : "Account number"} value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="•••• 4242" />
      </Sheet>
    </div>
  );
}

function FeeRow({ label, amount, status, extra }: { label: string; amount: number; status: string; extra?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{usd(amount)}{extra ? ` · ${extra}` : ""}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
