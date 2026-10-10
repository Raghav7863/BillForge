"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Invoices", icon: Receipt, href: "/invoices" },
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Products", icon: Package, href: "/products" },
];

type LeftSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function LeftSidebar({
  sidebarOpen,
  setSidebarOpen,
}: LeftSidebarProps) {
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : undefined,
        }}
        className={`fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col justify-between bg-[#1c1b1d] shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300`}
      >
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bef264] text-lg font-bold text-[#4b6e00]">
                B
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight tracking-tight text-[#fefff1]">
                  BillForge
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]">
                  FinOps Cloud
                </span>
              </div>
            </div>

            {/* Mobile Close */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-[#c3c9b2] transition-colors hover:text-[#e5e1e4] lg:hidden"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>

            {/* Desktop Workspace Switcher */}
            <button
              type="button"
              className="hidden text-[#c3c9b2] transition-colors hover:text-[#e5e1e4] lg:block"
              aria-label="Switch workspace"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Workspace */}
          <div className="px-4 pb-2 pt-1">
            <div className="flex items-center justify-between rounded bg-[#201f22] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]">
              <span>Acme Global LLC</span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#bff365]" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-2 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${isActive
                      ? "border-l-2 border-[#bef264] bg-[#2a2a2c] font-medium text-[#e5e1e4]"
                      : "text-[#c3c9b2] hover:bg-[#2a2a2c] hover:text-[#e5e1e4]"
                    }`}
                >
                  <Icon size={18} />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div className="flex flex-col gap-1 p-2">
          {/* Settings */}

          {
            session?.user.id ? <div
              onClick={() => { signOut({callbackUrl: "/"}) }}
              className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${pathname === "/settings" ||
                  pathname.startsWith("/settings/")
                  ? "border-l-2 border-[#bef264] bg-[#2a2a2c] font-medium text-red-400"
                  : "text-[#c3c9b2] hover:bg-[#2a2a2c] hover:text-red-600"
                }`}
            >
              <LogOut size={18} />

              <span>LogOut</span>
            </div> : ""
          }


          {/* Security Status */}
          <div className="mt-1 flex items-center justify-between rounded-lg bg-[#201f22] p-2">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={20}
                className="text-[#bff365]"
              />

              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#e5e1e4]">
                  SOC2 Type II
                </span>

                <span className="font-mono text-xs text-[#c3c9b2]">
                  Encrypted
                </span>
              </div>
            </div>

            <span className="h-2 w-2 animate-pulse rounded-full bg-[#a4d64c]" />
          </div>
        </div>
      </motion.aside>
    </>
  );
}
