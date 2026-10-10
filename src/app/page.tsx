"use client";

import { motion } from "framer-motion";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"

const features = [
  {
    icon: "↗",
    title: "Lightning Creation",
    description:
      "Keyboard-first invoice generation. Draft, preview, and send in seconds. Support for recurring billing and multiple currencies.",
  },
  {
    icon: "◎",
    title: "Real-time Tracking",
    description:
      "Know exactly when invoices are viewed and paid. Automated reminders handle the follow-up so you don't have to.",
  },
  {
    icon: "⌁",
    title: "Deep Analytics",
    description:
      "Understand your cash flow with high-density charts. Export data to standard accounting formats with one click.",
  },
];

const activity = [
  {
    invoice: "INV-2024",
    company: "Stark Ind.",
    status: "PAID",
    color: "text-[#bef264] bg-[#bef264]/10",
  },
  {
    invoice: "INV-2023",
    company: "Acme Corp",
    status: "OVERDUE",
    color: "text-red-300 bg-red-400/10",
  },
  {
    invoice: "INV-2025",
    company: "Wayne Ent.",
    status: "DRAFT",
    color: "text-zinc-300 bg-zinc-400/10",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function BillForgePage() {

  const { data: session, status } = useSession();

  const router = useRouter();

  if (!session) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#09090b] text-[#e5e1e4] antialiased">
        {/* Navigation */}
        <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#2a2a2c]/80 bg-[#131315]/80 px-5 backdrop-blur-md sm:px-6 lg:px-10">
          <a href="#" className="flex items-center gap-3">
            <span className="text-2xl text-[#bef264]">◈</span>
            <span className="text-xl font-bold tracking-tight">BillForge</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => { redirect("/login") }} className="hidden px-4 py-2 text-sm text-[#e5e1e4] transition-colors hover:text-[#bef264] sm:block">
              Sign In
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { redirect("/register") }}
              className="rounded bg-[#bef264] px-4 py-2 text-sm font-medium text-[#131315] transition-colors hover:bg-[#c8f77a] sm:px-5"
            >
              Start for free
            </motion.button>
          </div>
        </header>

        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 sm:px-6 lg:px-10 lg:pb-28 lg:pt-40">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
              linear-gradient(to right, rgba(39,39,42,.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(39,39,42,.4) 1px, transparent 1px)
            `,
              backgroundSize: "24px 24px",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(190,242,100,.15), transparent 60%)",
            }}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
          >
            <motion.h1
              variants={fadeUp}
              className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl"
            >
              Billing that feels{" "}
              <span className="text-[#bef264]">effortless.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#c3c9b2] sm:text-lg"
            >
              Create invoices, track payments, and understand revenue from one
              place. Built for precision. Designed for speed.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 mb-14 flex w-full flex-col items-center gap-4 sm:mb-20 sm:w-auto sm:flex-row"
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { redirect("/register") }}
                className="flex w-full items-center justify-center gap-2 rounded bg-[#bef264] px-8 py-3 text-base font-medium text-[#131315] transition-colors hover:bg-[#c8f77a] sm:w-auto"
              >
                Start for free
                <span>→</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex w-full items-center justify-center gap-2 rounded border border-[#353437] bg-transparent px-8 py-3 text-base text-[#e5e1e4] transition-colors hover:bg-[#2a2a2c] sm:w-auto"
              >
                <span>▶</span>
                View demo
              </motion.button>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              variants={fadeUp}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="relative mt-2 w-full max-w-[1000px]"
            >
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#bef264]/20 to-[#353437]/20 blur-xl" />

              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex h-[380px] w-full flex-col overflow-hidden rounded-xl border border-[#353437] bg-[#1c1b1d] shadow-2xl sm:h-[500px]"
              >
                {/* Browser Header */}
                <div className="flex h-12 shrink-0 items-center gap-4 border-b border-[#353437] bg-[#131315] px-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#353437]" />
                    <div className="h-3 w-3 rounded-full bg-[#353437]" />
                    <div className="h-3 w-3 rounded-full bg-[#353437]" />
                  </div>

                  <div className="mx-auto flex w-full max-w-md items-center rounded border border-[#353437] bg-[#09090b] px-3 py-1.5 text-left text-xs text-[#c3c9b2]/50">
                    <span className="mr-2">⌕</span>
                    Search invoices...
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 overflow-hidden bg-[#09090b]">
                  {/* Sidebar */}
                  <aside className="hidden w-48 shrink-0 flex-col gap-2 border-r border-[#353437] bg-[#1c1b1d] p-4 sm:flex">
                    {[
                      ["▦", "Overview", true],
                      ["□", "Invoices", false],
                      ["♙", "Clients", false],
                    ].map(([icon, label, active]) => (
                      <div
                        key={label as string}
                        className={`flex items-center gap-3 rounded px-3 py-2 text-sm ${active
                            ? "bg-[#353437] text-[#e5e1e4]"
                            : "text-[#c3c9b2]"
                          }`}
                      >
                        <span>{icon}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </aside>

                  {/* Dashboard */}
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 sm:p-6 md:grid-cols-3">
                    {/* Revenue */}
                    <div className="flex min-h-[240px] flex-col rounded-lg border border-[#353437] bg-[#201f22] p-4 sm:p-5 md:col-span-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
                        Total Revenue
                      </span>

                      <div className="mb-4 mt-2 flex items-end gap-3">
                        <span className="text-2xl font-semibold sm:text-[32px]">
                          $124,500.00
                        </span>
                        <span className="mb-1 text-xs text-[#bef264] sm:text-sm">
                          +14.2%
                        </span>
                      </div>

                      <div className="relative min-h-0 flex-1 border-t border-[#353437] pt-4">
                        <svg
                          className="absolute inset-0 h-full w-full pt-4"
                          preserveAspectRatio="none"
                          viewBox="0 0 100 40"
                        >
                          <path
                            d="M0 35 Q 10 20, 20 25 T 40 15 T 60 20 T 80 5 T 100 10"
                            fill="none"
                            stroke="#bef264"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                          <path
                            d="M0 35 Q 10 20, 20 25 T 40 15 T 60 20 T 80 5 T 100 10 L 100 40 L 0 40 Z"
                            fill="rgba(190,242,100,.05)"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="hidden flex-col gap-4 rounded-lg border border-[#353437] bg-[#201f22] p-5 md:flex">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
                        Recent Activity
                      </span>

                      <div className="flex flex-col gap-3">
                        {activity.map((item) => (
                          <div
                            key={item.invoice}
                            className="flex items-center justify-between border-b border-[#353437] pb-2 last:border-0"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm text-[#e5e1e4]">
                                {item.invoice}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider text-[#c3c9b2]">
                                {item.company}
                              </span>
                            </div>

                            <span
                              className={`rounded px-2 py-1 text-[9px] font-semibold ${item.color}`}
                            >
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-y border-[#353437] bg-[#0e0e10] px-5 py-20 sm:px-6 lg:px-10 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-12 text-center sm:mb-16"
            >
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Precision tools for financial flow
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#c3c9b2] sm:text-lg">
                Everything you need to manage the lifecycle of a payment,
                without the clutter.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -5 }}
                  className="rounded-xl border border-[#353437] bg-[#1c1b1d] p-6 transition-colors hover:bg-[#2a2a2c] sm:p-8"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#bef264]/10 text-xl text-[#bef264]">
                    {feature.icon}
                  </div>

                  <h3 className="mb-3 text-xl font-medium">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-6 text-[#c3c9b2]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="about"
          className="border-t border-[#353437] bg-[#131315] px-5 pb-8 pt-16 sm:px-6 lg:px-10 lg:pt-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-10 md:mb-16 md:flex-row">
              <div className="max-w-sm">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl text-[#bef264]">◈</span>
                  <span className="text-xl font-bold">BillForge</span>
                </div>

                <p className="text-sm leading-6 text-[#c3c9b2]">
                  Enterprise billing infrastructure designed for modern
                  workflows. Fast, reliable, and effortless.
                </p>
              </div>

              <div className="flex gap-16">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-semibold tracking-wider">
                    PRODUCT
                  </span>

                  <a
                    href="#features"
                    className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
                  >
                    Pricing
                  </a>
                  <a
                    href="#"
                    className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
                  >
                    Integrations
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-xs font-semibold tracking-wider">
                    COMPANY
                  </span>

                  <a
                    href="#about"
                    className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
                  >
                    Blog
                  </a>
                  <a
                    href="#"
                    className="text-sm text-[#c3c9b2] transition-colors hover:text-[#bef264]"
                  >
                    Careers
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-[#353437] pt-8 text-center md:flex-row md:text-left">
              <p className="text-sm text-[#c3c9b2]/60">
                © 2024 BillForge Inc. All rights reserved.
              </p>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-sm text-[#c3c9b2]/60 transition-opacity hover:text-[#c3c9b2]"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-sm text-[#c3c9b2]/60 transition-opacity hover:text-[#c3c9b2]"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  router.push("/dashboard");

}