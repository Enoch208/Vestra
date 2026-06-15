import { ArrowUpRight01Icon, SmartPhone01Icon } from "hugeicons-react";
import { Pill } from "@/components/ui/Pill";
import { CTAGallery } from "@/components/landing/CTAGallery";

const PATHS = [
  {
    title: "MiniPay Mini App",
    badge: "Web · Celo",
    body: "Open Vestra directly inside MiniPay. Verify with Self, set your daily amount, and the agent handles the rest — no app download required.",
  },
  {
    title: "Telegram Bot",
    badge: "@VestraBot",
    body: "Save and manage your account entirely via Telegram. Check your streak, request advances, and get daily confirmations — wherever you are.",
  },
] as const;

export function CTASection() {
  return (
    <section
      id="start"
      className="relative mx-auto mt-24 max-w-7xl rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-white/[0.06] to-white/0 p-6 backdrop-blur sm:p-10"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-foreground/80">
            <SmartPhone01Icon size={14} strokeWidth={1.5} className="text-accent" />
            Start saving today
          </span>

          <h2 className="mt-4 text-[42px] font-light leading-[1.05] tracking-tighter text-foreground sm:text-6xl">
            Save your first $0.10.
          </h2>

          <div className="mt-2 h-px bg-white/10" />

          {PATHS.map((path) => (
            <div key={path.title} className="mt-6">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-light tracking-tighter text-foreground sm:text-3xl">
                  {path.title}
                </h3>
                <Pill>{path.badge}</Pill>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{path.body}</p>
              <div className="mt-6 h-px bg-white/10" />
            </div>
          ))}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/dashboard"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-white to-neutral-300 px-7 text-sm font-medium text-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
            >
              Open Mini App
            </a>
            <a
              href="https://t.me/VestraBot"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.08]"
            >
              Open Telegram bot
              <ArrowUpRight01Icon size={14} strokeWidth={1.5} className="text-muted transition-all group-hover:text-foreground group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <CTAGallery />
        </div>
      </div>
    </section>
  );
}
