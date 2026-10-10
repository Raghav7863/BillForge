"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from "@/components/ui/Topbar";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Inbox,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import axios from "axios";
import LeftSidebar from "@/components/ui/LeftSidebar";
import {useRouter} from "next/navigation";

/* =========================================================
   TYPES
   These types can later match your backend/API response.
========================================================= */

type Stat = {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType: "positive" | "neutral" | "negative";
  changeIcon?: React.ElementType;
};

type AttentionItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  type: "danger" | "default";
};

type InvoiceStatus = "Overdue" | "Paid" | "Sent" | "Draft";

type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
  status: InvoiceStatus;
};

type DashboardStats = {
  clientsCount: number;
  paidInvoices: number;
  pendingAmount: number;
  recentInvoices: {
    _id: string;
    invoiceNumber: string;
    total: number;
    dueDate: string;
    status: string;
    clientId?: {
      name: string;
    };
  }[];
  totalInvoices: number;
  totalRevenue: number;

  revenueOverTime: {
    date: string;
    amount: number;
  }[];
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [period, setPeriod] = useState("30D");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const router = useRouter();

  type DashboardAttentionItem = {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    type: "danger" | "default";
  };

  const dashboardData = {
    user: {
      name: "Alex",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCJHDuBi6WlBQm6-ThinRtx42bMyeAsZAimJjUsT1ZtzfniYsjVpSGqT5la8kk3t1oZrSUU4lKeSj9HwjgC6xsI2RUPSNIZ4_jc8t6vIhqt-ML1N5Ninz1xQ9kTzua4x1CWduBqOOrp_PT8d_pDq-qcKp34ANMpQhGgRhgxXqnzj0gs-2TEIbjl9phc2LobUolK7YOXYtTvFgd8tn7QPIs-hFIYy6WMtYPT24dwUN4R_K6v9ubbnJlw",
    },

    stats: [
      {
        id: "revenue",
        label: "Total Revenue",
        value: `₹ ${dashboardStats?.totalRevenue ?? 0}`,
        icon: Wallet,
        change: "",
        changeType: "positive",
      },
      {
        id: "pending",
        label: "Pending Amount",
        value: `₹ ${dashboardStats?.pendingAmount ?? 0}`,
        icon: Inbox,
        changeType: "neutral",
      },
      {
        id: "total-invoices",
        label: "Total Invoices",
        value: `${dashboardStats?.totalInvoices ?? 0}`,
        icon: AlertTriangle,
        changeType: "negative",
        changeIcon: TrendingUp,
      },
      {
        id: "paid",
        label: "Paid Invoices",
        value: `${dashboardStats?.paidInvoices ?? 0}`,
        icon: CheckCircle2,
        changeType: "positive",
        changeIcon: TrendingUp,
      },
    ] satisfies Stat[],

    attention:
      dashboardStats?.recentInvoices
        .filter(
          (invoice) =>
            invoice.status === "overdue" ||
            invoice.status === "draft"
        )
        .slice(0, 3)
        .map((invoice) => ({
          id: invoice._id,

          title:
            invoice.status === "overdue"
              ? `${invoice.invoiceNumber} Overdue`
              : `Draft: ${invoice.clientId?.name || "Unknown"}`,

          subtitle:
            invoice.status === "overdue"
              ? `${invoice.clientId?.name || "Unknown"} · ₹ ${invoice.total}`
              : "Pending Approval",

          icon:
            invoice.status === "overdue"
              ? AlertTriangle
              : FileText,

          type:
            invoice.status === "overdue"
              ? "danger"
              : "default",
        })) ?? [],

    invoices:
      dashboardStats?.recentInvoices.map((invoice) => ({
        id: invoice.invoiceNumber,

        client: invoice.clientId?.name || "Unknown",

        amount: `₹ ${invoice.total}`,

        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : "-",

        status:
          invoice.status.charAt(0).toUpperCase() +
          invoice.status.slice(1),
      })) ?? [],
  };

  const data = dashboardData;

  const getDetails = async () => {
    try {
      const response = await axios.get("/api/dashboard");

      console.log("Dashboard:", response.data);

      setDashboardStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    }
  };

  useEffect(() => {

    getDetails();

  }, [])

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4]">

      <LeftSidebar
        sidebarOpen={mobileMenuOpen}
        setSidebarOpen={setMobileMenuOpen}
        activeItem="Overview"
      />

      <Topbar
        avatar={data.user.avatar}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <main className="pt-16 lg:ml-[260px]">
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {/* Page header */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-[32px]">
                Good morning, {data.user.name}
              </h1>

              <p className="mt-1 text-sm text-[#c3c9b2] sm:text-base">
                Here&apos;s what&apos;s happening with your business.
              </p>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { router.push("/invoices/create") }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#bef264] px-4 py-2.5 text-sm font-semibold text-[#4b6e00] transition-colors hover:bg-[#bff365] sm:w-auto"
            >
              <Plus size={18} />
              Create invoice
            </motion.button>
          </motion.div>

          {/* Stats */}
          <StatsGrid stats={data.stats} />

          {/* Chart + attention */}
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RevenueChart
              period={period}
              setPeriod={setPeriod}
              revenueData={dashboardStats?.revenueOverTime ?? []}
            />

            <AttentionPanel items={data.attention} />
          </div>

          {/* Invoices */}
          <InvoiceTable invoices={data.invoices} />
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   STATS
========================================================= */

function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const ChangeIcon = stat.changeIcon;

        return (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className={[
              "rounded-lg border bg-[#1c1b1d] p-4",
              "transition-colors",
              stat.changeType === "negative"
                ? "border-[#434938] hover:border-[#ffb4ab]/50"
                : "border-[#434938] hover:border-[#bff365]/50",
            ].join(" ")}
          >
            <div className="mb-2 flex items-start justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#c3c9b2]">
                {stat.label}
              </span>

              <Icon
                size={18}
                className={
                  stat.changeType === "negative"
                    ? "text-[#ffb4ab]"
                    : "text-[#c3c9b2]"
                }
              />
            </div>

            <div className="font-mono text-xl font-semibold tracking-tight sm:text-2xl">
              {stat.value}
            </div>

            <div
              className={[
                "mt-2 flex items-center gap-1 text-sm",
                stat.changeType === "positive"
                  ? "text-[#a4d64c]"
                  : stat.changeType === "negative"
                    ? "text-[#ffb4ab]"
                    : "text-[#c3c9b2]",
              ].join(" ")}
            >
              {ChangeIcon && <ChangeIcon size={14} />}
              {stat.change}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* =========================================================
   REVENUE CHART
========================================================= */

function RevenueChart({
  period,
  setPeriod,
  revenueData,
}: {
  period: string;
  setPeriod: (period: string) => void;
  revenueData: {
    date: string;
    amount: number;
  }[];
}) {
  const chartTotal = revenueData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const maxAmount = Math.max(
    ...revenueData.map((item) => item.amount),
    1
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="lg:col-span-2 rounded-lg border border-[#434938] bg-[#1c1b1d] p-4"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium sm:text-xl">
            Revenue Overview
          </h2>

          <p className="mt-1 font-mono text-2xl font-semibold">
            ₹ {chartTotal.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="flex rounded-lg border border-[#434938] bg-[#131315] p-1">
          {["7D", "30D", "90D", "1Y"].map((option) => (
            <button
              key={option}
              onClick={() => setPeriod(option)}
              className={[
                "rounded px-3 py-1.5 text-xs font-medium transition",
                period === option
                  ? "bg-[#bef264] text-[#4b6e00]"
                  : "text-[#c3c9b2] hover:text-[#e5e1e4]",
              ].join(" ")}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[280px] items-end gap-2 overflow-hidden">
        {revenueData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#c3c9b2]">
            No revenue data available
          </div>
        ) : (
          revenueData.map((item, index) => {
            const height = Math.max(
              (item.amount / maxAmount) * 100,
              3
            );

            return (
              <motion.div
                key={`${item.date}-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.03,
                }}
                title={`${item.date}: ₹ ${item.amount.toLocaleString(
                  "en-IN"
                )}`}
                className="min-w-[6px] flex-1 rounded-t bg-[#bef264] opacity-80 transition hover:opacity-100"
              />
            );
          })
        )}
      </div>
    </motion.section>
  );
}

/* =========================================================
   ATTENTION
========================================================= */

function AttentionPanel({
  items,
}: {
  items: AttentionItem[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="flex h-[400px] flex-col rounded-lg border border-[#434938] bg-[#1c1b1d]"
    >
      <div className="border-b border-[#434938] p-4">
        <h2 className="text-lg font-medium sm:text-xl">
          Needs Attention
        </h2>
      </div>

      <div className="space-y-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-[#c3c9b2]">
            Nothing needs attention.
          </div>
        ) : (
          items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="group flex w-full items-center gap-3 rounded p-2 text-left transition hover:bg-[#353437]"
              >
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded",
                    item.type === "danger"
                      ? "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                      : "border border-[#434938] bg-[#353437] text-[#c3c9b2]",
                  ].join(" ")}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">
                    {item.title}
                  </div>

                  <div className="mt-0.5 truncate font-mono text-[11px] text-[#c3c9b2]">
                    {item.subtitle}
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-[#c3c9b2] opacity-0 transition group-hover:opacity-100"
                />
              </motion.button>
            );
          })
        )}
      </div>
    </motion.section>
  );
}

/* =========================================================
   INVOICE TABLE
========================================================= */

function InvoiceTable({
  invoices,
}: {
  invoices: Invoice[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="mt-4 overflow-hidden rounded-lg border border-[#434938] bg-[#1c1b1d]"
    >
      <div className="flex items-center justify-between border-b border-[#434938] p-4">
        <h2 className="text-lg font-medium sm:text-xl">
          Recent Invoices
        </h2>

        <button className="flex items-center gap-1 text-sm text-[#bff365] hover:text-[#bef264]">
          <span className="hidden sm:block">View all</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-180">
          <thead>
            <tr className="border-b border-[#434938]">
              <TableHeading>Invoice #</TableHeading>
              <TableHeading>Client</TableHeading>
              <TableHeading align="right">Amount</TableHeading>
              <TableHeading>Due Date</TableHeading>
              <TableHeading>Status</TableHeading>
              <TableHeading />
            </tr>
          </thead>

          <tbody className="divide-y divide-[#434938]/50">

            {
              invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText
                        size={32}
                        className="mb-3 text-[#c3c9b2]"
                      />

                      <p className="text-sm font-medium text-[#e5e1e4]">
                        No invoices found
                      </p>

                      <p className="mt-1 text-xs text-[#c3c9b2]">
                        You haven&apos;t created any invoices yet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) :  (invoices.map((invoice, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + index * 0.08 }}
                  className="group hover:bg-[#353437]"
                >
                  <td className="px-4 py-3 font-mono text-sm">
                    {invoice.id}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {invoice.client}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {invoice.amount}
                  </td>

                  <td className="px-4 py-3 font-mono text-sm text-[#c3c9b2]">
                    {invoice.dueDate}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={invoice.status} />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button className="text-[#c3c9b2] opacity-0 hover:text-white group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>)
              ))
            }
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

/* =========================================================
   TABLE HELPERS
========================================================= */

function TableHeading({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2] ${align === "right" ? "text-right" : "text-left"
        }`}
    >
      {children}
    </th>
  );
}

function StatusBadge({
  status,
}: {
  status: InvoiceStatus;
}) {
  const styles: Record<InvoiceStatus, string> = {
    Overdue:
      "border-[#ffb4ab]/20 bg-[#ffb4ab]/10 text-[#ffb4ab]",
    Paid:
      "border-[#a4d64c]/20 bg-[#a4d64c]/10 text-[#a4d64c]",
    Sent:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
    Draft:
      "border-[#434938] bg-[#353437] text-[#c3c9b2]",
  };

  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]
        }`}
    >
      {status}
    </span>
  );
}
