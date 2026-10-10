"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  CreditCard,
  Eye,
  FileText,
  Filter,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MoreVertical,
  Pencil,
  Search,
  Settings,
  Users,
  Wallet,
  X,
  Boxes,
  RefreshCw,
  UserRound,
  Landmark,
  Delete,
  Trash2,
} from "lucide-react";
import axios from "axios";
import LeftSidebar from "@/components/ui/LeftSidebar";
import Topbar from "@/components/ui/Topbar";

type Client = {
  id: number;
  initials: string;
  name: string;
  company: string;
  email: string;
  invoices: number;
  outstanding: string;
  status: "Active" | "Inactive";
  avatar?: string;
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Invoices", icon: FileText },
  { label: "Clients", icon: Users, active: true },
  { label: "Products", icon: Boxes },
  { label: "Payments", icon: CreditCard },
  { label: "Recurring", icon: RefreshCw },
  { label: "Analytics", icon: BarChart3 },
];

const footerItems = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: HelpCircle },
];

export default function ClientsPage() {

  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();


  const [clients, setClients] = useState<Client[]>([]);

  async function fetchClients() {

    const response = await axios.get("/api/clients");

    setClients(response.data.clients);

  }


  useEffect(() => {

    async function getClients() {

      const response = await axios.get("/api/clients");

      setClients(response.data.clients);

    }

    getClients();

  }, [])

  async function handleDelete(clientId: string) {

    await axios.delete(`/api/clients/${clientId}`);

    fetchClients();

  }

  const stats = [
    {
      label: "Total Clients",
      value: clients.length,
      description: "Total Clients",
      icon: Users,
      type: "normal",
    },
  ];

  const filteredClients = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return clients;

    return clients.filter((client) =>
      `${client.name} ${client.company} ${client.email} ${client.status}`
        .toLowerCase()
        .includes(query),
    );
  }, [search, clients]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#131315] text-[#e5e1e4]">

      <LeftSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="Clients"
      />

      {/* Main */}
      <div className="min-h-screen md:ml-[260px]">

        <Topbar
          avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCRuQV-En1cHWXY5xtATcGfA50JlXHeki7p-U-k1_SeLwcV75mnJYiznWG1k1KWGflx84DTAIq4q6evJUWTNrPxDt_yrH0fUM2XllqnW5giNoJNnyMqA7f4kHmchbev6bV8ZjpiK7Unyx-iHZCPlBgNu-00Wux7fkW4QXyCCE-k_y4feyJn5thiNBIXnwzB0ND4h2ZpNC45esj1hyUOUPBED4uW-0z5A1UrAzYyWO4CIVjQbvmGXezm"
          onMenuClick={() => setSidebarOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />


        {/* Page */}
        <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-8 pt-24 sm:px-6 lg:gap-8 lg:px-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#e5e1e4]">
                Clients
              </h2>

              <p className="mt-1 text-sm text-[#c3c9b2]">
                Manage your customer base and track outstanding balances.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { router.push("/clients/new") }}
              className="flex shrink-0 items-center gap-2 rounded bg-[#bef264] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#131315] transition-colors hover:bg-[#fefff1]"
            >
              <Plus size={18} />
              Add Client
            </motion.button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  className="group relative overflow-hidden will-change-transform rounded-lg border border-[#434938] bg-[#201f22] p-4 transition-colors hover:border-[#8d937e]"
                >
                  <div
                    className={`absolute -right-5 -top-5 h-24 w-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${stat.type === "danger"
                      ? "bg-red-500/10"
                      : "bg-[#353437]/40"
                      }`}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      <Icon size={16} />
                      {stat.label}
                    </div>

                    <div
                      className={`mt-2 font-mono text-2xl ${stat.type === "danger"
                        ? "text-[#ffb4ab]"
                        : "text-[#e5e1e4]"
                        }`}
                    >
                      {stat.value}
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-sm text-[#c3c9b2]">
                      {stat.type === "danger" ? (
                        <>
                          <span className="text-[#ffb4ab]">
                            ₹12,000
                          </span>
                          overdue
                        </>
                      ) : stat.label === "Total Clients" ? (
                        <>
                          <span className="text-[#bff365]">
                            +12%
                          </span>
                          from last month
                        </>
                      ) : (
                        stat.description
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Directory */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="overflow-hidden rounded-lg border border-[#434938] bg-[#201f22]"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-[#434938] bg-[#1c1b1d] px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Client Directory
              </span>

              <div className="flex gap-1">
                <button className="rounded p-1.5 text-[#c3c9b2] transition hover:bg-[#353437] hover:text-white">
                  <Filter size={18} />
                </button>

                <button className="rounded p-1.5 text-[#c3c9b2] transition hover:bg-[#353437] hover:text-white">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead className="border-b border-[#434938] bg-[#1c1b1d]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Client
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Company
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Email
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Invoices
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Outstanding
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#434938]">
                  <AnimatePresence mode="popLayout">
                    {filteredClients.map((client, index) => (
                      <motion.tr
                        key={index}
                        layout
                        initial={{
                          opacity: 0,
                          x: -15,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: 15,
                        }}
                        transition={{
                          duration: 0.25,
                          delay: index * 0.05,
                        }}
                        className="group h-12 transition-colors hover:bg-[#2a2a2c]"
                      >
                        {/* Client */}
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            {client.avatar ? (
                              <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-[#353437]">
                                <img
                                  src={client.avatar}
                                  alt={client.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold ${client.id === 3
                                  ? "bg-[#e1e0ea] text-[#62636b]"
                                  : "bg-[#454747] text-[#e5e1e4]"
                                  }`}
                              >
                                {client.initials}
                              </div>
                            )}

                            <span className="font-semibold text-[#e5e1e4]">
                              {client.name}
                            </span>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-4 py-2 text-sm text-[#c3c9b2]">
                          {client.company}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-2 text-sm text-[#c3c9b2]">
                          {client.email}
                        </td>

                        {/* Invoices */}
                        <td className="px-4 py-2 text-right font-mono text-sm">
                          {client.invoices}
                        </td>

                        {/* Outstanding */}
                        <td
                          className={`px-4 py-2 text-right font-mono text-sm ${client.outstanding !== "₹0"
                            ? "font-bold text-[#ffb4ab]"
                            : "text-[#c3c9b2]"
                            }`}
                        >
                          {client.outstanding}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${client.status === "Active"
                              ? "border-[#bff365]/20 bg-[#a4d64c]/10 text-[#bff365]"
                              : "border-[#434938] bg-[#353437] text-[#c3c9b2]"
                              }`}
                          >
                            {client.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-2">
                          <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                            <button className="rounded p-1 text-[#c3c9b2] transition hover:text-[#bef264]">
                              <Eye size={18} />
                            </button>

                            <button onClick={() => { router.push(`/clients/${client._id}`) }} className="rounded p-1 text-[#c3c9b2] transition hover:text-white">
                              <Pencil size={18} />
                            </button>

                            <button onClick={() => { handleDelete(client._id) }} className="rounded p-1 text-[#c3c9b2] transition hover:text-[#990000]">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Empty state */}
              {filteredClients.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-40 items-center justify-center text-sm text-[#8d937e]"
                >
                  No clients found.
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-[#434938] bg-[#1c1b1d] px-4 py-3 text-sm text-[#c3c9b2] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing 1 to {filteredClients.length} of 248 clients
              </span>

              <div className="flex gap-1">
                <button
                  disabled
                  className="flex items-center gap-1 rounded border border-[#434938] px-3 py-1.5 transition hover:bg-[#2a2a2c] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={14} />
                  Prev
                </button>

                <button className="flex items-center gap-1 rounded border border-[#434938] px-3 py-1.5 transition hover:bg-[#2a2a2c]">
                  Next
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
