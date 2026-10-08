import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Connect, Plugin } from "vite";

/** Serve the phone-frame page itself. Otherwise the app router treats /preview.html as a missing screen. */
function servePreviewHtml(): Plugin {
  const file = resolve(process.cwd(), "preview.html");
  const send: Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? "").split("?")[0];
    if (!path.endsWith("/preview.html")) return next();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(readFileSync(file));
  };
  const install = (server: { middlewares: Connect.Server }) => {
    server.middlewares.stack.unshift({ route: "", handle: send });
  };
  return {
    name: "serve-preview-html",
    configureServer(server) {
      install(server);
    },
    configurePreviewServer(server) {
      install(server);
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "preview.html", source: readFileSync(file) });
    },
  };
}

export default defineConfig({
  // Nitro writes Vercel Build Output API files to `.vercel/output` on `vite build`.
  nitro: { preset: "vercel" },
  vite: {
    base: "/",
    plugins: [servePreviewHtml()],
    server: {
      allowedHosts: ["localhost", "127.0.0.1", ".vercel.app"],
    },
    preview: {
      allowedHosts: ["localhost", "127.0.0.1", ".vercel.app"],
    },
  },
});
