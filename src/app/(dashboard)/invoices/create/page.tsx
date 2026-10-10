"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  Settings,
  Trash2,
  Users,
  X,
} from "lucide-react";
import axios from "axios";
import { g } from "framer-motion/client";
import { useRouter } from "next/navigation";
import LeftSidebar from "@/components/ui/LeftSidebar";

type Products = {
  _id: number;
  businessId: string;
  name: string;
  description: string;
  price: number;
  taxRate: number;
  quantity: number;
  type: string;
  unit: string;
};

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}


interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: Client;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  status:
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";
}

const initialproducts: InvoiceItem[] = [
  {
    id: 1,
    description: "Website Dev",
    quantity: 2,
    price: 25000,
    tax: 18,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);

const inputClass =
  "w-full rounded border border-[#434938] bg-[#131315] px-3 py-2 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#62665a] focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]";

const inlineInputClass =
  "w-full border-0 border-b border-transparent bg-transparent p-0 text-sm text-[#e5e1e4] outline-none transition-all focus:border-[#bef264] focus:ring-0";

export default function page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [client, setClient] = useState<Invoice[]>([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [products, setProducts] = useState<Products[]>([]);

  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [total, setTotal] = useState();
  const [subtotal, setSubtotal] = useState<number>(0);
  const [clientId, setClientId] = useState("");

  const [selectedProducts, setSelectedProducts] = useState<
    {
      productId: number;
      quantity: number;
    }[]
  >([]);


  const router = useRouter();


  const [loading, setLoading] = useState(false);

  const [notes, setNotes] = useState("");

  async function fetchClients() {
    const response = await axios.get("/api/clients", { withCredentials: true });

    setClient(response.data.clients);

    console.log(response.data);
  }

  async function fetchProducts() {
    const response = await axios.get("/api/products", { withCredentials: true });

    setProducts(response.data.products);

    console.log(response.data);
  }

  const items = selectedProducts;

  const getSubTotal = useMemo(() => {
    return selectedProducts.reduce((sum, selected) => {
      const product = products.find(
        (product) => product._id === selected.productId
      );

      if (!product) return sum;

      return sum + product.price * selected.quantity;
    }, 0);
  }, [products, selectedProducts]);



  const getTotalTax = useMemo(() => {
    return selectedProducts.reduce((total, selected) => {
      const product = products.find(
        (product) => product._id === selected.productId
      );

      if (!product) return total;

      const itemSubtotal = product.price * selected.quantity;
      const itemTax = itemSubtotal * (product.taxRate / 100);

      return total + itemTax;
    }, 0);
  }, [products, selectedProducts]);


  const getTotal = useMemo(() => {
    return getSubTotal + getTotalTax;
  }, [getSubTotal, getTotalTax]);

  const validItems = products.filter(
    (product) => product._id
  )

  async function handleSubmit() {

    try {

      console.log("clientId:", clientId);
      console.log("issueDate:", issueDate);
      console.log("dueDate:", dueDate);
      console.log("selectedProducts:", selectedProducts);


      const response = await axios.post("/api/invoices", {
        clientId,
        issueDate,
        dueDate,
        items,
        notes,
      })

      console.log("Invoice created:", response.data);

      router.push("/invoices");

    } catch (error: any) {
      console.log("error, ", error.response.data);
    }

  }

  useEffect(() => {

    fetchClients();

    fetchProducts();

  }, [])

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === id
          ? {
            ...item,
            [field]:
              field === "description"
                ? value
                : Number(value) || 0,
          }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setProducts((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#131315] font-sans text-[#e5e1e4] antialiased selection:bg-[#bef264] selection:text-[#131315]">

      <LeftSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="Invoices"
      />

      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 products-center justify-between border-b border-[#434938] bg-[#131315]/95 px-4 backdrop-blur-md lg:hidden">
        <div className="flex products-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded p-2 text-[#c3c9b2] transition-colors hover:bg-[#2a2a2c] hover:text-[#bef264]"
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div className="flex h-9 w-9 products-center justify-center rounded bg-[#bef264] font-semibold text-[#233600]">
            B
          </div>

          <span className="font-semibold text-[#fefff1]">
            BillForge
          </span>
        </div>

        <button
          type="button"
          className="rounded p-2 text-[#c3c9b2] hover:text-[#bef264]"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="min-h-screen lg:ml-[260px]">
        {/* Desktop Top Bar */}
        <header className="fixed right-0 top-0 z-40 hidden h-16 border-b border-[#434938] bg-[#131315]/95 px-6 backdrop-blur-md lg:flex lg:w-[calc(100%-260px)] lg:products-center lg:justify-between xl:px-10">
          <div className="flex flex-1 products-center">
            <div className="relative w-64">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#c3c9b2]"
              />

              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded border border-[#353437] bg-[#1c1b1d] py-2 pl-10 pr-3 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#c3c9b2] focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
              />
            </div>
          </div>

          <div className="flex products-center gap-6">
            <button
              type="button"
              className="text-[#c3c9b2] transition-colors hover:text-[#bef264]"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <button
              type="button"
              className="flex products-center gap-2 text-[#c3c9b2] hover:text-[#bef264]"
            >
              <div className="flex h-8 w-8 products-center justify-center rounded-full border border-[#434938] bg-[#353437] text-xs font-medium text-[#bef264]">
                BF
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Page */}
        <main className="min-h-screen overflow-y-auto px-4 pb-8 pt-20 sm:px-6 lg:h-screen lg:px-8 lg:pb-10 lg:pt-24 xl:px-10">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-4 sm:flex-row sm:products-center sm:justify-between"
            >
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#e5e1e4] sm:text-[32px]">
                  Create Invoice
                </h1>

                <p className="mt-1 text-sm text-[#c3c9b2]">
                  Draft a new invoice. Drafts are saved automatically.
                </p>
              </div>
            </motion.div>

            {/* Invoice Card */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="rounded-lg border border-[#434938] bg-[#1c1b1d] p-4 shadow-sm sm:p-6"
            >
              {/* Client + Dates */}
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                {/* Client */}
                <div className="flex flex-col gap-3 lg:border-r lg:border-[#434938] lg:pr-8">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                    Bill To
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#c3c9b2]"
                    />

                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full appearance-none rounded border border-[#434938] bg-[#131315] py-3 pl-10 pr-10 text-base text-[#e5e1e4] outline-none transition-all focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                    >

                      <option value="">Select a client</option>

                      {
                        client.map((client, index) => (
                          <option key={client._id} value={client._id}>{client.name}</option>
                        ))
                      }

                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c3c9b2]"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="flex flex-col gap-4">
                  <DateField
                    label="Issue Date"
                    value={issueDate}
                    onChange={setIssueDate}
                  />

                  <DateField
                    label="Due Date"
                    value={dueDate}
                    onChange={setDueDate}
                  />

                  <div className="flex flex-col gap-2 border-t border-[#434938] pt-3 sm:flex-row sm:products-center sm:justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Invoice No.
                    </span>

                    <span className="font-mono text-sm text-[#e5e1e4]">
                      INV-2024-0042
                    </span>
                  </div>
                </div>
              </div>

              {/* Line products */}
              <div className="border-t border-[#434938] pt-6">
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#434938]">
                        <th className="w-[38%] pb-2 text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                          Product / Service
                        </th>
                        <th className="w-[10%] pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                          Qty
                        </th>
                        <th className="w-[15%] pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                          Price
                        </th>
                        <th className="w-[12%] pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                          Tax
                        </th>
                        <th className="w-[17%] pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                          Amount
                        </th>
                        <th className="w-[8%]" />
                      </tr>
                    </thead>

                    <tbody>
                      <AnimatePresence initial={false}>
                        {products.map((product, index) => {
                          return (
                            <motion.tr
                              key={product._id}
                              layout
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              className="group border-b border-[#353437] transition-colors hover:bg-[#2a2a2c]"
                            >
                              <td className="py-3 pr-2">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedProducts.some(
                                      (item) => item.productId === product._id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedProducts((current) => [
                                          ...current,
                                          {
                                            productId: product._id,
                                            quantity: 1,
                                          },
                                        ]);
                                      } else {
                                        setSelectedProducts((current) =>
                                          current.filter(
                                            (item) => item.productId !== product._id
                                          )
                                        );
                                      }
                                    }}
                                    className="h-4 w-4 accent-[#bef264]"
                                  />


                                  <input
                                    type="text"
                                    value={product.description}
                                    readOnly
                                    className={inlineInputClass}
                                    placeholder="Item description"
                                  />
                                </div>
                              </td>


                              <td className="px-2 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    updateItem(
                                      product._id,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  className={`${inlineInputClass} text-right font-mono`}
                                />
                              </td>

                              <td className="px-2 py-3">
                                <div className="relative flex products-center">
                                  <span className="absolute left-1 font-mono text-sm text-[#c3c9b2]">
                                    ₹
                                  </span>

                                  <input
                                    type="number"
                                    min="0"
                                    value={product.price}
                                    onChange={(e) =>
                                      updateItem(
                                        product._id,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    className={`${inlineInputClass} pl-5 text-right font-mono`}
                                  />
                                </div>
                              </td>

                              <td className="px-2 py-3">
                                <div className="relative">
                                  <input
                                    type="number"
                                    min="0"
                                    value={product.taxRate}
                                    onChange={(e) =>
                                      updateItem(
                                        product._id,
                                        "tax",
                                        e.target.value
                                      )
                                    }
                                    className={`${inlineInputClass} pr-5 text-right font-mono`}
                                  />
                                  <span className="pointer-events-none absolute right-0 top-0 font-mono text-sm text-[#c3c9b2]">
                                    %
                                  </span>
                                </div>
                              </td>

                              <td className="px-2 py-3 text-right font-mono text-sm text-[#e5e1e4]">
                                ₹
                                {formatCurrency(
                                  product.price
                                )}
                              </td>

                              <td className="py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeItem(product._id)}
                                  className="rounded p-1.5 text-[#c3c9b2] opacity-0 transition-all hover:text-[#ffb4ab] group-hover:opacity-100"
                                  aria-label="Delete item"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile products */}
                <div className="space-y-4 md:hidden">
                  <AnimatePresence initial={false}>
                    {products.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg border border-[#434938] bg-[#131315] p-4"
                      >
                        <div className="mb-4 flex products-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                            Item {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeItem(item._id)}
                            className="rounded p-2 text-[#c3c9b2] hover:text-[#ffb4ab]"
                            aria-label="Delete item"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="mb-1.5 block text-xs text-[#c3c9b2]">
                              Product / Service
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateItem(
                                  item._id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className={inputClass}
                              placeholder="Item description"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1.5 block text-xs text-[#c3c9b2]">
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(
                                    item._id,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} font-mono`}
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-xs text-[#c3c9b2]">
                                Tax
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.taxRate}
                                  onChange={(e) =>
                                    updateItem(
                                      item._id,
                                      "tax",
                                      e.target.value
                                    )
                                  }
                                  className={`${inputClass} pr-8 font-mono`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#c3c9b2]">
                                  %
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs text-[#c3c9b2]">
                              Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c3c9b2]">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={item.price}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "price",
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} pl-8 font-mono`}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between border-t border-[#353437] pt-3">
                            <span className="text-sm text-[#c3c9b2]">
                              Amount
                            </span>
                            <span className="font-mono text-sm">
                              ₹
                              {formatCurrency(
                                item.quantity * item.price
                              )}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Notes + Summary */}
              <div className="mt-6 grid grid-cols-1 gap-6 border-t border-[#434938] pt-6 lg:grid-cols-[1.4fr_1fr]">
                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                    Notes / Terms
                  </label>

                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Payment due within 15 days. Bank details: AC: 123456789, IFSC: BKID000123"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Summary */}
                <motion.div
                  layout
                  className="flex flex-col justify-center gap-3 rounded border border-[#434938] bg-[#131315] p-4"
                >
                  <SummaryRow
                    label="Subtotal"
                    value={String(getSubTotal)}
                  />

                  <SummaryRow
                    label="Tax"
                    value={`₹${formatCurrency(getTotalTax)}`}
                  />

                  <div className="my-1 border-t border-[#434938]" />

                  <div className="flex products-end justify-between gap-4">
                    <span className="text-base font-bold text-[#e5e1e4]">
                      Total
                    </span>

                    <motion.span
                      key={10}
                      initial={{ scale: 1.05, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-mono text-2xl font-bold leading-none text-[#bef264]"
                    >
                      ₹{formatCurrency(getTotal)}
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Footer Action */}
            <div className="flex justify-stretch sm:justify-end">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                onClick={() => { handleSubmit() }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full products-center justify-center gap-2 rounded bg-[#bef264] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#131315] transition-colors hover:bg-[#d5ff8d] sm:w-auto"
              >
                Create Invoice
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Workspace Header */}
      <div className="mb-8 flex products-center justify-between px-4">
        <div className="flex products-center gap-4">
          <div className="flex h-10 w-10 shrink-0 products-center justify-center rounded bg-[#bef264] text-lg font-semibold text-[#233600]">
            B
          </div>

          <div>
            <h2 className="text-xl font-semibold leading-none text-[#fefff1]">
              BillForge
            </h2>

            <p className="mt-1 text-xs text-[#c3c9b2]">
              Enterprise Billing
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded p-2 text-[#c3c9b2] hover:bg-[#2a2a2c] hover:text-[#e5e1e4]"
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* New Invoice */}
      <div className="mb-6 px-4">
        <button
          type="button"
          onClick={onNavigate}
          className="flex w-full products-center justify-center gap-2 rounded bg-[#bef264] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#131315] transition-colors hover:bg-[#d5ff8d]"
        >
          <Plus size={17} />
          New Invoice
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={onNavigate}
              className={`flex products-center gap-4 border-l-2 px-4 py-2.5 text-left text-sm transition-colors ${item.active
                ? "border-[#bef264] bg-[#2a2a2c] text-[#e5e1e4]"
                : "border-transparent text-[#c3c9b2] hover:bg-[#2a2a2c] hover:text-[#e5e1e4]"
                }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="flex flex-col gap-1">
        {footerNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={onNavigate}
              className="flex products-center gap-4 border-l-2 border-transparent px-4 py-2.5 text-left text-sm text-[#c3c9b2] transition-colors hover:bg-[#2a2a2c] hover:text-[#e5e1e4]"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:products-center sm:justify-between">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-[#434938] bg-[#131315] px-3 py-2 font-mono text-sm text-[#e5e1e4] outline-none transition-all focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] sm:w-2/3"
      />
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
    <div className="flex products-center justify-between gap-4">
      <span className="text-sm text-[#c3c9b2]">{label}</span>
      <span className="font-mono text-sm text-[#e5e1e4]">
        {value}
      </span>
    </div>
  );
}
