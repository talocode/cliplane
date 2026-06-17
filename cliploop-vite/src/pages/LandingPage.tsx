import { Link } from "react-router-dom";
import { ClipLoopLogo } from "@/components/ui/ClipLoopLogo";

const sections = [
  {
    title: "Open-source workflow",
    body: "ClipLoop is open-source by default. The CLI is open. The SDK is open. The workflow is open. The hosted API is optional.",
  },
  {
    title: "CLI",
    body: "Use the open CLI to draft scripts, storyboards, and export-ready launch copy from the terminal.",
    code: "npx @talocode/cliploop",
  },
  {
    title: "SDK",
    body: "Install the SDK when you want ClipLoop workflows inside apps, dashboards, agents, or automation.",
    code: "npm install @talocode/cliploop-sdk",
  },
  {
    title: "Grok-compatible MCP setup",
    body: "Use ClipLoop from MCP-compatible chat clients to create scripts, storyboards, X exports, and hosted render jobs with permission.",
    code: "npx @talocode/cliploop-mcp",
  },
  {
    title: "Hosted API keys",
    body: "Need hosted rendering? Get an API key from cliploop.site. Local script, storyboard, and export work without a key.",
  },
  {
    title: "Tera AI integration",
    body: "ClipLoop is designed to connect into Tera so chat answers, lessons, and product updates can become video scripts and storyboards.",
  },
];

const links = [
  { label: "GitHub repo", href: "https://github.com/talocode/cliploop" },
  { label: "@talocode/cliploop", href: "https://www.npmjs.com/package/@talocode/cliploop" },
  { label: "@talocode/cliploop-sdk", href: "https://www.npmjs.com/package/@talocode/cliploop-sdk" },
  { label: "@talocode/cliploop-mcp", href: "https://www.npmjs.com/package/@talocode/cliploop-mcp" },
  { label: "GitHub Releases", href: "https://github.com/talocode/cliploop/releases" },
  { label: "Grok MCP docs", href: "/docs/GROK_MCP.md" },
  { label: "Tera integration", href: "/docs/TERA_INTEGRATION.md" },
];

export default function LandingPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-[#202020] bg-[#090909] px-5 py-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] md:px-8 md:py-8">
        <div className="flex flex-col gap-4 border-b border-[#1B1B1B] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <ClipLoopLogo href="/" />
          <div className="flex flex-wrap items-center gap-2">
            <a href="https://github.com/talocode/cliploop" className="rounded-full border border-[#272727] px-3 py-1.5 text-xs font-medium text-[#D4D4D4] transition hover:border-[#3A3A3A] hover:text-white">GitHub</a>
            <Link to="/pricing" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-neutral-200">Pricing</Link>
          </div>
        </div>

        <div className="grid gap-8 py-8 md:grid-cols-[1.1fr_0.9fr] md:py-10">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B8B8B]">Open-source video workflow for builders</p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">Open-source video workflow for builders</h1>
            <p className="max-w-xl text-base leading-7 text-[#A3A3A3] md:text-lg">Turn product updates, lessons, and launch notes into scripts, storyboards, render jobs, and short-form promo assets.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.npmjs.com/package/@talocode/cliploop" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">npx @talocode/cliploop</a>
              <a href="https://www.npmjs.com/package/@talocode/cliploop-sdk" className="rounded-full border border-[#272727] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#3A3A3A] hover:bg-[#111111]">npm install @talocode/cliploop-sdk</a>
              <a href="https://www.npmjs.com/package/@talocode/cliploop-mcp" className="rounded-full border border-[#272727] px-5 py-3 text-sm font-semibold text-[#D4D4D4] transition hover:border-[#3A3A3A] hover:text-white">Connect with MCP</a>
            </div>
            <div className="grid gap-3 pt-2 text-sm text-[#8B8B8B] sm:grid-cols-2">
              <div className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555]">Package</p>
                <p className="mt-2 font-medium text-white">@talocode/cliploop</p>
              </div>
              <div className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555]">Hosted API</p>
                <p className="mt-2 font-medium text-white">Optional</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1F1F1F] bg-[#0D0D0D] p-5">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <p className="text-sm font-semibold text-white">Quick start</p>
              <span className="rounded-full border border-[#242424] px-2.5 py-1 text-[11px] font-medium text-[#A3A3A3]">Local-first</span>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-[#232323] bg-black p-4 text-[12px] leading-6 text-[#EDEDED]"><code>{`npx @talocode/cliploop-mcp
npm install @talocode/cliploop-sdk

import { ClipLoopLocal } from "@talocode/cliploop-sdk";`}</code></pre>
            <p className="mt-4 text-sm leading-6 text-[#8B8B8B]">Local mode works without an API key. Hosted rendering is optional and permission-gated.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1B1B1B] pt-5 text-xs text-[#737373]">
          <p>Built by Talocode for open video workflows.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://github.com/talocode/cliploop" className="transition hover:text-white">GitHub</a>
            <a href="https://cliploop.site" className="transition hover:text-white">cliploop.site</a>
            <a href="https://app.cliploop.site/app" className="transition hover:text-white">App</a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-[#1E1E1E] bg-[#0B0B0B] p-5 md:col-span-1">
            <h2 className="text-base font-semibold text-white">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#A3A3A3]">{section.body}</p>
            {section.code ? <pre className="mt-3 overflow-x-auto rounded-xl border border-[#232323] bg-black p-3 text-xs text-[#EDEDED]"><code>{section.code}</code></pre> : null}
          </article>
        ))}
      </section>

      <section className="grid gap-4 rounded-[2rem] border border-[#1E1E1E] bg-[#090909] p-5 md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B8B8B]">Developer docs</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">Everything you need to wire ClipLoop into MCP clients and Tera-style chat systems.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#A3A3A3]">ClipLoop stays open-source by default, with local deterministic outputs and optional hosted rendering for users who want it.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map((item) => (
            <a key={item.label} href={item.href} className="rounded-2xl border border-[#202020] bg-[#0D0D0D] px-4 py-3 text-sm font-medium text-white transition hover:border-[#3A3A3A] hover:bg-[#111111]">{item.label}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
