"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { convertToWords } from 'react-number-to-words';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Activity,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clipboard,
  Copy,
  CreditCard,
  Download,
  Edit3,
  FileText,
  History,
  KeyRound,
  LayoutDashboard,
  Menu,
  Package,
  PanelLeftClose,
  Printer,
  Receipt,
  Send,
  Settings,
  ShieldCheck,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { NextRequest } from "next/server";
import { cosineSimilarity } from "@langchain/core/utils/math";
import LeftSidebar from "@/components/ui/LeftSidebar";
import InvoicePrint from "@/components/InvoicePrint";
import Link from "next/link";

type ToastState = {
  message: string;
  icon: React.ReactNode;
} | null;

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-[#c3c9b2] transition-colors hover:bg-[#2a2a2c] hover:text-[#e5e1e4]"
    >
      {children}
    </button>
  );
}

export default function InvoicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState("pending");
  const [sendLoading, setSendLoading] = useState<boolean>(false);

  const statusOptions = [
    "draft",
    "sent",
    "paid",
    "overdue",
    "cancelled",
  ];

  const params = useParams();

  const showToast = (message: string, icon: React.ReactNode = <CheckCircle2 />) => {
    setToast({ message, icon });

    window.setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handlePrint = () => {
    window.print();
  };

  async function fetchInvoice() {
    try {
      const response = await axios.get(`/api/invoices/${params.id}`);

      console.log("FULL INVOICE:", response.data.invoice);
      console.log("STATUS FROM API:", response.data.invoice.status);

      setInvoice(response.data.invoice);
      setItems(response.data.invoice.items);
      setInvoiceStatus(response.data.invoice.status);

    } catch (error) {
      console.error("Failed to fetch invoice:", error);
    }
  }
  const handleDownloadPDF = () => {
    const invoiceElement = document.getElementById("invoiceSheet");

    if (!invoiceElement) {
      console.error("Invoice element not found");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1200");

    if (!printWindow) {
      alert("Please allow popups to download the PDF.");
      return;
    }

    // Copy all current stylesheets
    const styles = Array.from(
      document.querySelectorAll("link[rel='stylesheet'], style")
    )
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.open();

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <title>${invoice.invoiceNumber ?? "Invoice"}</title>

        ${styles}

        <style>
          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 210mm;
            min-height: 297mm;
            background: #fffdff !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #invoiceSheet {
            width: 210mm !important;
            min-height: 297mm !important;
            max-width: none !important;

            margin: 0 !important;
            border-radius: 0 !important;

            box-shadow: none !important;

            overflow: hidden !important;
          }

          @media print {
            body {
              width: 210mm;
              min-height: 297mm;
            }

            #invoiceSheet {
              page-break-after: avoid;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        ${invoiceElement.outerHTML}

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 500);
          };

          window.onafterprint = function () {
            window.close();
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  async function handleStatusChange(status: string) {
    try {
      // Update UI immediately
      setInvoiceStatus(status);
      setStatusOpen(false);

      // Save status to database
      await axios.patch(
        `/api/invoices/${params.id}`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      );

      showToast(
        `Invoice status changed to ${status.toUpperCase()}`,
        <CheckCircle2 size={19} />
      );

      // Fetch latest invoice data
      await fetchInvoice();

    } catch (error) {
      console.error("Failed to update invoice status:", error);

      showToast(
        "Failed to update invoice status",
        <X size={19} />
      );

      // Get the actual status back from database
      await fetchInvoice();
    }
  }

  useEffect(() => {

    fetchInvoice();

  }, [])

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#131315] text-[#e5e1e4]">
        Loading invoice...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131315] font-sans text-[#e5e1e4] antialiased">

      <LeftSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="Invoices"
      />

      {/* Main Application */}
      <div className="lg:pl-[260px]">
        {/* Header */}
        <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.02] bg-[#131315]/80 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-[260px] lg:px-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-md text-[#c3c9b2] hover:bg-[#2a2a2c] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <span className="hidden text-[#c3c9b2] sm:inline">
              Billing
            </span>
            <span className="hidden text-[#c3c9b2] sm:inline">/</span>
            <span className="font-medium text-[#e5e1e4]">
              Operations Console
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative hidden md:flex">
              <Clipboard
                size={17}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#c3c9b2]"
              />

              <input
                type="text"
                placeholder="Search records (⌘K)..."
                className="h-8 w-48 rounded bg-[#1c1b1d] pl-8 pr-2 text-sm text-[#e5e1e4] outline-none placeholder:text-[#8d937e] focus:ring-1 focus:ring-[#bef264] lg:w-64"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                showToast(
                  "New invoice creation flow opened.",
                  <Receipt size={19} />
                )
              }
              className="flex h-8 items-center gap-1.5 rounded bg-[#bef264] px-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#4b6e00] transition-colors hover:bg-[#a4d64c]"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">New Invoice</span>
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              <IconButton
                label="Notifications"
                onClick={() =>
                  showToast(
                    "You have no new notifications.",
                    <Bell size={19} />
                  )
                }
              >
                <Bell size={19} />
              </IconButton>

              <IconButton
                label="Help"
                onClick={() =>
                  showToast("Help center opened.", <CircleHelp size={19} />)
                }
              >
                <CircleHelp size={19} />
              </IconButton>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fefff1] text-[#233600]">
              <User size={17} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-screen bg-[#131315] pt-16">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-6">
            {/* Command Bar */}
            <div className="mb-6 flex flex-col gap-2">
              <Link
                href="/invoices"
                className="group inline-flex w-fit items-center gap-1 text-sm text-[#c3c9b2] transition-colors hover:text-[#fefff1]"
              >
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span>Back to Invoices</span>
              </Link>

              <div className="flex flex-col justify-between gap-4 pt-1 xl:flex-row xl:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-[#fefff1] sm:text-[32px]">
                    Invoice {invoice.invoiceNumber}
                  </h1>

                  <div className="relative"> <button type="button" onClick={() => setStatusOpen((prev) => !prev)} className="inline-flex items-center gap-1.5 rounded-full bg-[#2a2a2c] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300 transition-colors hover:bg-[#353437]" > <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> <span>{invoiceStatus}</span> <ChevronDown size={13} className={`transition-transform ${statusOpen ? "rotate-180" : ""}`} /> </button> <AnimatePresence> {statusOpen && (<motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.98 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-[#353437] bg-[#1c1b1d] p-1 shadow-xl" > {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors ${invoiceStatus === status
                        ? "bg-[#2a2a2c] text-amber-300"
                        : "text-[#c3c9b2] hover:bg-[#2a2a2c] hover:text-[#e5e1e4]"
                        }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${invoiceStatus === status
                          ? "bg-amber-400"
                          : "bg-[#62636b]"
                          }`}
                      />

                      {status}
                    </button>
                  ))} </motion.div>)} </AnimatePresence> </div>

                  <span className="inline-flex items-center gap-1 rounded bg-[#1c1b1d] px-2 py-1 font-mono text-xs text-[#c3c9b2]">
                    <Zap size={14} className="text-[#a4d64c]" />
                    Due in 15 days
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <ActionButton
                    icon={<Download size={18} />}
                    label="Download PDF"
                    onClick={async () => {
                      handleDownloadPDF();
                    }}
                  />

                  <ActionButton
                    icon={<Send size={18} />}
                    label={sendLoading ? "Sending..." : "Send Invoice"}
                    onClick={async () => {

                      showToast(
                        `Invoice dispatched to ${invoice.clientId.email}`,
                        <Send size={19} />
                      )

                      setSendLoading(true);

                      const response = await axios.post(`/api/invoices/${invoice._id}/send`);

                      setInvoiceStatus("sent");

                      setSendLoading(false);

                      showToast(
                        `Successfully Sent Invoice to ${invoice.clientId.email}`,
                        <Send size={19} />
                      )

                      console.log(response.data);
                    }
                    }
                  />
                </div>
              </div>
            </div>

            {/* Workspace */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              {/* Invoice */}
              <div className="flex min-w-0 flex-col items-center lg:col-span-8">
                {/* Document Meta */}
                <div className="pdf-hide flex w-full flex-col gap-2 px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#bff365]" />
                      Printable Sheet (A4 Equivalent)
                    </span>

                    <span className="hidden text-[#353437] sm:inline">/</span>

                    <span className="font-mono lowercase">
                      scale: 100%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    <span className="rounded bg-[#1c1b1d] px-1.5 py-0.5">
                      210 × 297 mm
                    </span>
                    <span className="rounded bg-[#1c1b1d] px-1.5 py-0.5">
                      GST Compliance v2.4
                    </span>
                  </div>
                </div>

                {/* Printable Invoice */}
                <InvoicePrint
                  invoice={invoice}
                  items={items}

                />
              </div>

              {/* Right Operations Panel */}
              <div className="flex flex-col gap-4 lg:col-span-4">
                {/* Ledger Snapshot */}
                <DashboardCard>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Ledger Snapshot
                    </span>
                    <Wallet size={18} className="text-[#bff365]" />
                  </div>

                  <div className="mt-1">
                    <span className="font-mono text-2xl font-bold tracking-tight text-[#fefff1] sm:text-3xl">
                      ₹ {invoice.total}
                    </span>

                    <span className="mt-0.5 block text-sm text-[#c3c9b2]">
                      Total payable amount
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-[#201f22] p-2">
                    <InfoStat
                      label="Status"
                      value={invoiceStatus}
                      accent
                    />
                    <InfoStat
                      label="Created"
                      value={invoice.createdAt.split("T")[0]}
                    />
                    <InfoStat
                      label="Client ID"
                      value="CLI-RAHUL-09"
                    />
                    <InfoStat
                      label="Tax Model"
                      value="GST (Standard)"
                    />
                  </div>
                </DashboardCard>

                {/* Security */}
                <DashboardCard>
                  <div className="flex items-center gap-2">
                    <KeyRound
                      size={20}
                      className="text-[#a4d64c]"
                    />

                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#e5e1e4]">
                        Cryptographic Integrity
                      </span>

                      <span className="font-mono text-xs text-[#c3c9b2]">
                        SHA-256 Checksum Validated
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 truncate rounded bg-[#201f22] p-1.5 font-mono text-[11px] text-[#c3c9b2]">
                    f8a29b8c04d5e9112ab7834cf91d80327f
                  </div>
                </DashboardCard>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-5 z-[100] flex max-w-[calc(100vw-40px)] items-center gap-2 rounded-lg bg-[#353437] px-4 py-2.5 text-[#e5e1e4] shadow-2xl"
          >
            <span className="text-[#bff365]">
              {toast.icon}
            </span>

            <span className="text-sm font-medium">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-1.5 rounded bg-[#201f22] px-2.5 text-sm text-[#e5e1e4] transition-colors hover:bg-[#2a2a2c]"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SmallButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 items-center justify-center gap-1.5 rounded bg-[#2a2a2c] text-sm text-[#e5e1e4] transition-colors hover:bg-[#353437]"
    >
      <span className="text-[#c3c9b2]">{icon}</span>
      {label}
    </button>
  );
}

function DashboardCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-[#1c1b1d] p-4 shadow-md"
    >
      {children}
    </motion.div>
  );
}

function InfoStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
        {label}
      </span>

      <span
        className={`mt-0.5 block font-mono text-xs ${accent ? "font-medium text-amber-300" : "text-[#e5e1e4]"
          }`}
      >
        {accent && (
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
        )}
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm text-[#62636b]">
      <span>{label}</span>
      <span className="font-mono text-[#2f3037]">{value}</span>
    </div>
  );
}

function InvoiceRow({
  name,
  description,
  qty,
  rate,
  tax,
  total,
}: {
  name: string;
  description: string;
  qty: string;
  rate: string;
  tax: string;
  total: string;
}) {
  return (
    <tr className="border-b border-[#e1e0ea] transition-colors hover:bg-[#e2e1eb]/50">
      <td className="px-3 py-3 align-top">
        <div className="font-semibold text-[#2f3037]">{name}</div>
        <div className="mt-0.5 text-xs text-[#62636b]">
          {description}
        </div>
      </td>

      <td className="px-2 py-3 text-center align-top font-mono">
        {qty}
      </td>

      <td className="px-2 py-3 text-right align-top font-mono">
        {rate}
      </td>

      <td className="px-2 py-3 text-right align-top font-mono text-[#62636b]">
        {tax}
      </td>

      <td className="px-3 py-3 text-right align-top font-mono font-semibold">
        {total}
      </td>
    </tr>
  );
}
