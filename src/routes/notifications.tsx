import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useGuard, EmptyState, PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
});

function Notifications() {
  const app = useGuard();
  const navigate = useNavigate();
  const groups = ["Today", "Earlier"] as const;

  if (!app.user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader
        title="Notifications"
        fallback="/overview"
        right={
          <button type="button" className="text-sm font-semibold text-[#7A22C8]" onClick={() => app.markAllRead()}>
            Mark all read
          </button>
        }
      />
      <div className="space-y-4 px-4">
        {app.notifications.length === 0 && <EmptyState title="You’re caught up" body="New applications, referrals, interviews, and payments will land here." />}
        {groups.map((group) => {
          const items = app.notifications.filter((item) => item.group === group);
          if (!items.length) return null;
          return (
            <section key={group}>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{group}</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className={`flex items-stretch overflow-hidden rounded-[16px] bg-card shadow-[0_4px_16px_rgba(27,27,47,0.06)] ${item.read ? "opacity-70" : ""}`}>
                    <button
                      type="button"
                      className="min-w-0 flex-1 px-4 py-3 text-left"
                      onClick={() => {
                        app.markRead(item.id);
                        if (item.href.startsWith("/jobs/")) {
                          const jobId = item.href.split("/")[2] ?? "";
                          navigate({ to: "/jobs/$jobId", params: { jobId } });
                        } else if (item.href.startsWith("/referrals/")) {
                          navigate({ to: "/referrals/$referralId", params: { referralId: item.href.split("/")[2] ?? "" } });
                        } else if (item.href === "/payments") {
                          navigate({ to: "/payments" });
                        } else {
                          navigate({ to: "/overview" });
                        }
                      }}
                    >
                      <p className="font-semibold text-heading">{item.title}</p>
                      <p className="text-sm leading-5 text-muted-foreground">{item.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p>
                    </button>
                    <button type="button" className="bg-[#FEE2E2] px-3 text-xs font-semibold text-danger" onClick={() => app.removeNotification(item.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
