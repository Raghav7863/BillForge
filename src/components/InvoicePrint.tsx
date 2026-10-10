"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { convertToWords } from "react-number-to-words";

interface InvoicePrintProps {
  invoice: any;
  items: any[];
}

export default function InvoicePrint({
  invoice,
  items,
}: InvoicePrintProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      id="invoiceSheet"
      className="relative w-full max-w-[840px] overflow-hidden rounded-xl bg-[#fffdff] p-5 text-[#2f3037] shadow-2xl sm:p-8 lg:p-10"
    >
      {/* Accent */}
      <div className="absolute left-0 right-0 top-0 h-1.5 bg-[#bef264]" />

      {/* Document Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#e1e0ea] pb-7 sm:flex-row">
        <div className="flex max-w-sm flex-col">
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#2f3037] text-xs font-bold text-white">
              BF
            </div>

            <span className="text-xl font-bold tracking-tight">
              BillForge
            </span>
          </div>

          <span className="text-sm font-semibold">
            Acme Corp / BillForge Workspace
          </span>

          <span className="mt-0.5 text-sm text-[#62636b]">
            123 Innovation Drive, Suite 400
          </span>

          <span className="text-sm text-[#62636b]">
            Tech City, TC 90210, United States
          </span>

          <div className="mt-2 flex flex-col gap-0.5 font-mono text-[11px] text-[#62636b]">
            <span>
              GSTIN:{" "}
              <strong className="text-[#2f3037]">
                22AAAAA0000A1Z5
              </strong>
            </span>

            <span>billing@acmecorp.example.com</span>
            <span>Phone: +1 (555) 123-4567</span>
          </div>
        </div>

        <div className="flex flex-col text-left sm:items-end sm:text-right">
          <span className="text-4xl font-bold leading-none tracking-tighter sm:text-5xl">
            INVOICE
          </span>

          <span className="mt-1 font-mono text-base font-semibold">
            #{invoice.invoiceNumber}
          </span>

          <div className="mt-4 flex flex-col gap-1 text-sm">
            <div className="flex gap-2 sm:justify-end">
              <span className="text-[#62636b]">Issue Date:</span>

              <span className="font-mono font-medium">
                {invoice.issueDate.split("T")[0]}
              </span>
            </div>

            <div className="flex gap-2 sm:justify-end">
              <span className="text-[#62636b]">Due Date:</span>

              <span className="font-mono font-semibold">
                {invoice.dueDate.split("T")[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Billed To */}
      <div className="my-7 rounded-lg bg-[#e2e1eb] p-4">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#45464e]">
          Billed To
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <h3 className="text-base font-bold">
              Rahul Enterprises
            </h3>

            <p className="mt-0.5 text-sm text-[#62636b]">
              Attn: Rahul Kumar (Principal Officer)
            </p>

            <p className="text-sm text-[#62636b]">
              {invoice.clientId.address}
            </p>
          </div>

          <div className="flex flex-col gap-0.5 font-mono text-[11px] text-[#62636b] md:text-right">
            <span className="font-medium text-[#2f3037]">
              {invoice.clientId.email}
            </span>

            <span>
              GSTIN:{" "}
              <strong className="font-semibold text-[#2f3037]">
                09ABCDE1234F1Z5
              </strong>
            </span>

            <span>Place of Supply: UP (09)</span>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-7 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="bg-[#e1e0ea] text-[10px] font-semibold uppercase tracking-wider text-[#62636b]">
              <th className="rounded-l px-3 py-2">
                Item & Description
              </th>

              <th className="px-2 py-2 text-center">
                Qty
              </th>

              <th className="px-2 py-2 text-right">
                Rate / Price
              </th>

              <th className="px-2 py-2 text-right">
                Tax Rate
              </th>

              <th className="rounded-r px-3 py-2 text-right">
                Total Amount
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {items.map((item: any, index: number) => (
              <InvoiceRow
                key={item.productId ?? index}
                name={item.name}
                description={item.description}
                qty={String(item.quantity)}
                rate={`₹${Number(item.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                tax={`${item.taxRate}% GST`}
                total={`₹${Number(item.total).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row">
        <div className="sm:max-w-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#62636b]">
            Amount in Words
          </span>

          <p className="mt-1 text-sm font-medium italic">
            Rupees {convertToWords(invoice.total)} Only
          </p>
        </div>

        <div className="w-full rounded-lg bg-[#e2e1eb] p-4 sm:w-80">
          <SummaryRow
            label="Subtotal:"
            value={`₹${invoice.subTotal}.00`}
          />

          <SummaryRow
            label="Total Tax"
            value={`₹${invoice.taxAmount}.00`}
          />

          <div className="my-2 h-px bg-[#e1e0ea]" />

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-base font-bold">
              Grand Total:
            </span>

            <span className="rounded bg-[#bef264]/20 px-2 py-0.5 font-mono text-xl font-bold text-[#4b6e00]">
              ₹{invoice.total}
            </span>
          </div>
        </div>
      </div>

      {/* Banking */}
      <div className="mb-7 grid grid-cols-1 gap-5 rounded-lg bg-[#e1e0ea] p-4 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#62636b]">
            Remittance / Banking Details
          </span>

          <div className="space-y-1 font-mono text-[11px]">
            <div>
              <span className="text-[#62636b]">
                Bank Name:
              </span>{" "}
              HDFC Bank / State Bank of India
            </div>

            <div>
              <span className="text-[#62636b]">
                Account Name:
              </span>{" "}
              Acme Corp FinOps
            </div>

            <div>
              <span className="text-[#62636b]">
                Account No:
              </span>{" "}
              123456789012
            </div>

            <div>
              <span className="text-[#62636b]">
                IFSC Code:
              </span>{" "}
              HDFC0001234
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#62636b]">
              Instant UPI Settlement
            </span>

            <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
              <span className="select-all rounded bg-[#fffdff] px-2 py-1 font-semibold">
                acmecorp@upi
              </span>

              <span className="text-[#62636b]">
                (Scan or Pay Direct)
              </span>
            </div>
          </div>

          <div className="mt-2 text-[11px] italic text-[#62636b]">
            Reference invoice identifier{" "}
            <strong>{invoice.invoiceNumber}</strong> on transaction remarks.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-end justify-between gap-5 md:flex-row">
        <div className="max-w-md">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#62636b]">
            Notes & Terms
          </span>

          <p className="text-sm leading-relaxed text-[#62636b]">
            Payment is due within 15 days of invoice date. Late
            payments are subject to a 1.5% monthly finance charge.
          </p>

          <p className="mt-1 text-sm font-semibold">
            Thank you for your business!
          </p>
        </div>

        <div className="flex min-w-[200px] flex-col items-center justify-center rounded-lg bg-[#e2e1eb] p-3 text-center">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#bef264]/30 text-[#4b6e00]">
            <ShieldCheck size={20} />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Authorized Signatory
          </span>

          <span className="font-mono text-[11px] text-[#62636b]">
            Acme Global FinOps Cloud
          </span>

          <span className="mt-0.5 font-mono text-[10px] text-[#62636b]">
            Digitally signed • {invoice.issueDate.split("T")[0]}
          </span>
        </div>
      </div>
    </motion.div>
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
      <span className="font-mono text-[#2f3037]">
        {value}
      </span>
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
        <div className="font-semibold text-[#2f3037]">
          {name}
        </div>

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