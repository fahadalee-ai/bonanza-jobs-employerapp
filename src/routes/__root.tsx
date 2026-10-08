import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import logoColor from "../img/logo.png";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider, STORAGE_KEY } from "../lib/store";
import { AppShell } from "../components/AppShell";


function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold text-heading">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">That screen isn’t part of the employer app.</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-[52px] items-center justify-center rounded-lg bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] px-6 text-[15px] font-semibold text-white"
      >
        Back to start
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold text-heading">Something went wrong</h1>
      <p className="mt-2 max-w-[280px] text-[15px] leading-6 text-muted-foreground">
        We couldn’t load this screen. Try again, or head back home.
      </p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="inline-flex h-[52px] items-center justify-center rounded-lg bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] text-[15px] font-semibold text-white"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-[52px] items-center justify-center rounded-lg border border-[#7A22C8] text-[15px] font-semibold text-[#7A22C8]"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "Bonanza Jobs" },
      {
        name: "description",
        content: "Post jobs, review talent and referrals, and manage hiring for your US company.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#F6F7FB" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: logoColor, type: "image/png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var raw=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var theme=raw&&JSON.parse(raw).theme;var dark=theme==="dark"||(theme==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(dark)document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppShell>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </AppShell>
      </AppProvider>
    </QueryClientProvider>
  );
}
