"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    CreditCard,
    Download,
    FileText,
    Filter,
    Gauge,
    Group,
    HelpCircle,
    LayoutDashboard,
    Menu,
    Package,
    Plus,
    Receipt,
    ReceiptText,
    Search,
    Settings,
    Users,
    WalletCards,
    X,
    Eye,
    RefreshCcw,
    Clock3,
    Trash
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import LeftSidebar from "@/components/ui/LeftSidebar";

type InvoiceStatus = "Paid" | "Overdue" | "Pending" | "Draft" | "Cancelled";

type Invoice = {
    _id: string;
    id: string;
    client: string;
    issueDate: string;
    amount: number;
    status: InvoiceStatus;
};

const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Invoices", icon: FileText, active: true },
    { label: "Clients", icon: Users },
    { label: "Products", icon: Package },
    { label: "Payments", icon: CreditCard },
    { label: "Recurring", icon: RefreshCcw },
    { label: "Analytics", icon: BarChart3 },
];

const footerItems = [
    { label: "Settings", icon: Settings },
    { label: "Help", icon: CircleHelp },
];

const statusStyles: Record<InvoiceStatus, string> = {
    Paid: "bg-green-500/10 text-green-400",
    Overdue: "bg-red-500/10 text-red-400",
    Pending: "bg-orange-500/10 text-orange-400",
    Draft: "bg-zinc-500/10 text-zinc-400",
    Cancelled: "bg-red-500/10 text-red-300",
};

const statusDots: Record<InvoiceStatus, string> = {
    Paid: "bg-green-400",
    Overdue: "bg-red-400",
    Pending: "bg-orange-400",
    Draft: "bg-zinc-400",
    Cancelled: "bg-red-300",
};

export default function page() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [statusFilter, setStatusFilter] = useState<"All" | InvoiceStatus>(
        "All",
    );

    const pendingInvoices = useMemo(() => {
        return invoices.filter((invoice) => invoice.status === "Pending");
    }, [invoices]);

    const pendingAmount = useMemo(() => {
        return pendingInvoices.reduce(
            (total, invoice) => total + invoice.amount,
            0
        );
    }, [pendingInvoices]);

    const overdueInvoices = useMemo(() => {
        return invoices.filter((invoice) => invoice.status === "Overdue");
    }, [invoices]);

    const overdueAmount = useMemo(() => {
        return overdueInvoices.reduce(
            (total, invoice) => total + invoice.amount,
            0
        );
    }, [overdueInvoices]);

    async function fetchInvoices() {
        try {
            const response = await axios.get("/api/invoices", {
                withCredentials: true,
            });

            console.log("API response:", response.data);

            const formattedInvoices: Invoice[] = response.data.invoices.map(
                (invoice: any) => ({
                    _id: invoice._id,
                    id: invoice.invoiceNumber,
                    client: invoice.clientId?.name ?? "Unknown Client",
                    issueDate: invoice.issueDate,
                    amount: invoice.total,
                    status:
                        invoice.status === "draft"
                            ? "Draft"
                            : invoice.status === "sent"
                                ? "Pending"
                                : invoice.status === "paid"
                                    ? "Paid"
                                    : invoice.status === "overdue"
                                        ? "Overdue"
                                        : "Cancelled",
                })
            );

            setInvoices(formattedInvoices);
        } catch (error) {
            console.error("Failed to fetch invoices:", error);
        }
    }

    async function handleDelete(id: any) {

        const response = await axios.delete(`/api/invoices/${id}`);

        router.push("/invoices");

        console.log(response.data);

    }


    useEffect(() => {

        fetchInvoices();

    }, [])

    const router = useRouter();

    const filteredInvoices = useMemo(() => {
        const query = search.toLowerCase().trim();

        return invoices.filter((invoice) => {
            const matchesSearch =
                !query ||
                invoice.id.toLowerCase().includes(query) ||
                invoice.client.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "All" || invoice.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [invoices, search, statusFilter]);

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-200">

            <LeftSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeItem="Invoices"
            />

            {/* Main content */}
            <main className="min-h-screen lg:ml-[260px]">
                <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col p-4 sm:p-6">
                    {/* Mobile header */}
                    <div className="mb-5 flex items-center justify-between lg:hidden">
                        <button
                            type="button"
                            aria-label="Open navigation"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded border border-[#2f302c] bg-[#18181b] p-2 text-zinc-300 transition-colors hover:bg-[#2a2a2c]"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#bef264]">
                                <ReceiptText className="h-4 w-4 text-[#09090b]" />
                            </div>
                            <span className="font-semibold">BillForge</span>
                        </div>

                        <div className="w-9" />
                    </div>

                    {/* Page header */}
                    <motion.header
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-[32px]">
                                Invoices
                            </h1>
                            <p className="mt-1 text-sm text-[#c3c9b2]">
                                Manage and track your outgoing billing.
                            </p>
                        </div>

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { router.push("/invoices/create") }}
                            className="flex w-full items-center justify-center gap-2 rounded bg-[#bef264] px-4 py-2 text-sm font-medium text-[#09090b] transition-opacity hover:opacity-90 sm:w-auto"
                        >
                            <Plus className="h-[18px] w-[18px]" />
                            Create Invoice
                        </motion.button>
                    </motion.header>

                    {/* Metrics */}
                    <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 sm:mb-8">
                        <MetricCard
                            title="All invoices"
                            value={`${invoices.length}`}
                            description="This month"
                            icon={Receipt}
                            iconClass="text-[#a4d64c]"
                            delay={0}
                        />

                        <MetricCard
                            title="Pending Amount"
                            value={`₹${pendingAmount.toLocaleString("en-IN")}`}
                            description={`Across ${pendingInvoices.length} invoices`}
                            icon={Clock3}
                            iconClass="text-orange-400"
                            delay={0.08}
                        />

                        <MetricCard
                            title="Overdue Amount"
                            value={`₹${overdueAmount.toLocaleString("en-IN")}`}
                            description={`Action required (${overdueInvoices.length})`}
                            icon={AlertTriangle}
                            iconClass="text-red-400"
                            valueClass="text-red-400"
                            delay={0.16}
                        />
                    </section>

                    {/* Invoice table */}
                    <motion.section
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                        className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b]"
                    >
                        {/* Toolbar */}
                        <div className="flex flex-col gap-3 border-b border-[#27272a] bg-[#0e0e10] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div className="flex items-center gap-2">
                                <Filter className="h-[18px] w-[18px] text-[#c3c9b2]" />

                                <label
                                    htmlFor="status-filter"
                                    className="text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]"
                                >
                                    Filter by Status
                                </label>

                                <select
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value as "All" | InvoiceStatus,
                                        )
                                    }
                                    className="ml-1 rounded border border-[#434938] bg-[#18181b] px-2 py-1 text-xs text-zinc-200 outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                                >
                                    <option value="All">All</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Overdue">Overdue</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#c3c9b2]" />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search invoices..."
                                    className="w-full rounded border border-[#434938] bg-[#09090b] py-2 pl-10 pr-4 text-sm text-zinc-200 outline-none transition-all placeholder:text-[#8d937e] focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                                />
                            </div>
                        </div>

                        {/* Responsive table */}
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full min-w-[760px] border-collapse text-left">
                                <thead className="sticky top-0 z-10 border-b border-[#27272a] bg-[#18181b]">
                                    <tr>
                                        <TableHeader>Invoice No</TableHeader>
                                        <TableHeader>Client</TableHeader>
                                        <TableHeader>Issue Date</TableHeader>
                                        <TableHeader align="right">Amount</TableHeader>
                                        <TableHeader>Status</TableHeader>
                                        <TableHeader align="right">Actions</TableHeader>
                                    </tr>
                                </thead>

                                <tbody className="text-sm">
                                    <AnimatePresence mode="popLayout">
                                        {filteredInvoices.map((invoice, index) => (
                                            <motion.tr
                                                key={invoice._id}
                                                layout
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                onClick={() => { router.push(`/invoices/${invoice._id}`) }}
                                                transition={{
                                                    duration: 0.25,
                                                    delay: index * 0.04,
                                                }}
                                                className="group h-12 border-b border-[#27272a] transition-colors hover:bg-[#1c1c1f]"
                                            >
                                                <td className="px-6 py-2 font-mono text-sm text-zinc-100">
                                                    {invoice.id}
                                                </td>

                                                <td className="px-6 py-2 font-medium text-zinc-100">
                                                    {invoice.client}
                                                </td>

                                                <td className="px-6 py-2 text-[#c3c9b2]">
                                                    {invoice.issueDate.split("T")[0]}
                                                </td>

                                                <td className="px-6 py-2 text-right font-mono text-sm tabular-nums text-zinc-100">
                                                    {invoice.amount}
                                                </td>

                                                <td className="px-6 py-2">
                                                    <StatusBadge status={invoice.status} />
                                                </td>

                                                <td className="px-6 py-2">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                        <Link href={`/invoices/${invoice._id}`}>
                                                            <IconButton
                                                                label="View invoice"
                                                                icon={Eye}
                                                            />
                                                        </Link>
                                                        <div onClick={() => { handleDelete(invoice._id) }}>
                                                            <IconButton
                                                                label="Download invoice"
                                                                icon={Trash}
                                                            />
                                                        </div>

                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>

                            {filteredInvoices.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex min-h-40 flex-col items-center justify-center gap-2 px-6 text-center"
                                >
                                    <Search className="h-7 w-7 text-zinc-600" />
                                    <p className="text-sm font-medium text-zinc-300">
                                        No invoices found
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Try changing your search or status filter.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-3 border-t border-[#27272a] bg-[#0e0e10] px-4 py-3 font-mono text-xs text-[#c3c9b2] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <span>
                                Showing {filteredInvoices.length} of {invoices.length}
                            </span>
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

type MetricCardProps = {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    iconClass?: string;
    valueClass?: string;
    delay?: number;
};

function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    iconClass = "text-zinc-300",
    valueClass = "text-zinc-100",
    delay = 0,
}: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -2 }}
            className="group relative overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b] p-5 sm:p-6"
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1c1b1d] to-transparent opacity-50" />

            <div className="relative z-10 flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                    {title}
                </span>

                <Icon className={`h-5 w-5 ${iconClass}`} />
            </div>

            <div
                className={`relative z-10 mt-3 font-mono text-2xl font-medium tracking-tight sm:text-[28px] ${valueClass}`}
            >
                {value}
            </div>

            <div className="relative z-10 mt-1 text-sm text-[#c3c9b2]">
                {description}
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${statusStyles[status]}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${statusDots[status]}`}
            />
            {status}
        </span>
    );
}

function TableHeader({
    children,
    align = "left",
}: {
    children: React.ReactNode;
    align?: "left" | "right";
}) {
    return (
        <th
            className={`whitespace-nowrap px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#c3c9b2] ${align === "right" ? "text-right" : "text-left"
                }`}
        >
            {children}
        </th>
    );
}

function IconButton({
    label,
    icon: Icon,
}: {
    label: string;
    icon: React.ElementType;
}) {
    return (
        <motion.button
            type="button"
            aria-label={label}
            title={label}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-[#2a2a2c] hover:text-zinc-100"
        >
            <Icon className="h-[18px] w-[18px]" />
        </motion.button>
    );
}
