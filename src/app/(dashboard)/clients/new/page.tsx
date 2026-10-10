"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {useRouter} from "next/navigation";
import axios from "axios";
import { cosineSimilarity } from "@langchain/core/utils/math";
import { signIn } from "next-auth/react";

const inputClass =
  "w-full rounded-md border border-[#27272a] bg-[#09090b] px-4 py-2.5 text-sm text-[#e5e1e4] placeholder:text-[#c3c9b2]/50 outline-none transition-all duration-200 focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] focus:shadow-[0_0_8px_rgba(190,242,100,0.2)]";

const labelClass = "block text-sm text-[#e5e1e4]";

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [country, setCountry] = useState("IN");

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("client_name")
    const email = formData.get("email")
    const phone = formData.get("phone")
    const company = formData.get("company_name")
    const gstin = formData.get("gstin")
    const address = formData.get("address")
    const city = formData.get("city")
    const state = formData.get("state")
    const postalCode = formData.get("postal_code")
    

    // Add your API request here.

    try {
      const response = await axios.post("/api/clients", {
        name,
        email, 
        phone,
        company,
        gstin,
        address,
        city,
        state,
        postalCode,
        country
    })

    console.log(response.data);

    router.push("/clients")

    setIsOpen(false);
    } catch (error) {
      console.error("Error: ", error);
    }

  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#131315] font-sans text-[#e5e1e4]">
      {/* Background Application */}
      <div
        className={`fixed inset-0 flex opacity-50 blur-sm transition-all ${
          isOpen ? "pointer-events-none" : ""
        }`}
      >
        {/* Sidebar */}
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#434938] bg-[#201f22] py-6 md:flex">
          <div className="mb-10 flex items-center gap-2 px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#bef264] font-bold text-[#4b6e00]">
              B
            </div>

            <div className="text-xl font-bold">BillForge</div>
          </div>

          <nav className="flex-1 space-y-1 px-2">
            <NavItem icon="⌂" label="Overview" />
            <NavItem icon="▤" label="Invoices" />

            <NavItem
              icon="♟"
              label="Clients"
              active
            />
          </nav>
        </aside>

        {/* Main Background */}
        <section className="flex min-w-0 flex-1 flex-col bg-[#131315]">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#434938] bg-[#131315] px-4 md:px-6">
            <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-[#434938] bg-[#2a2a2c] px-4 py-2 text-sm text-[#c3c9b2]">
              <span>⌕</span>
              <span>Search clients...</span>
            </div>

            <div className="ml-4 hidden items-center gap-4 sm:flex">
              <button className="rounded bg-[#bef264]/10 px-4 py-2 text-sm font-bold text-[#bef264]">
                Add Client
              </button>

              <div className="h-8 w-8 rounded-full bg-[#353437]" />
            </div>
          </header>

          {/* Fake dashboard content */}
          <div className="flex flex-1 gap-4 p-4 md:p-8">
            <div className="flex-1 rounded-lg border border-[#434938] bg-[#201f22]" />
            <div className="hidden w-80 rounded-lg border border-[#434938] bg-[#201f22] lg:block" />
          </div>
        </section>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              className="flex max-h-[94vh] w-full max-w-[800px] flex-col overflow-hidden rounded-lg border border-[#3f3f46] bg-[#1c1c1f] shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:max-h-[90vh]"
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              {/* Modal Header */}
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#27272a] px-4 py-4 sm:px-6">
                <div>
                  <h2
                    id="modal-title"
                    className="text-xl font-medium tracking-tight sm:text-2xl"
                  >
                    Add New Client
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#c3c9b2]">
                    Enter client details to create a new billing profile.
                  </p>
                </div>

                <motion.button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => { router.push("/clients") }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="shrink-0 rounded p-2 text-xl text-[#c3c9b2] transition-colors hover:bg-[#353437] hover:text-white"
                >
                  ×
                </motion.button>
              </div>

              {/* Scrollable Body */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                <form
                  id="add-client-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Primary Contact */}
                  <FormSection title="Primary Contact">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        label="Client Name"
                        id="client_name"
                        name="client_name"
                        placeholder="Rahul Kumar"
                      />

                      <FormField
                        label="Email Address"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="rahul@example.com"
                      />

                      <div className="md:col-span-2">
                        <FormField
                          label="Phone Number"
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          mono
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Business Details */}
                  <FormSection title="Business Details">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        label="Company Name"
                        id="company_name"
                        name="company_name"
                        placeholder="Rahul Enterprises"
                      />

                      <FormField
                        label="GSTIN"
                        id="gstin"
                        name="gstin"
                        placeholder="09ABCDE1234F1Z5"
                        mono
                        uppercase
                      />
                    </div>
                  </FormSection>

                  {/* Address */}
                  <FormSection title="Address & Location">
                    <div className="space-y-4">
                      <FormField
                        label="Address Line"
                        id="address"
                        name="address"
                        placeholder="123 Main Road"
                      />

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <FormField
                          label="City"
                          id="city"
                          name="city"
                          placeholder="Meerut"
                        />

                        <FormField
                          label="State/Province"
                          id="state"
                          name="state"
                          placeholder="Uttar Pradesh"
                        />

                        <div className="sm:col-span-2 md:col-span-1">
                          <FormField
                            label="Postal Code"
                            id="postal_code"
                            name="postal_code"
                            placeholder="250001"
                            mono
                          />
                        </div>
                      </div>

                      {/* Country */}
                      <div className="w-full md:w-1/3">
                        <label
                          htmlFor="country"
                          className="mb-2 block text-sm text-[#e5e1e4]"
                        >
                          Country
                        </label>

                        <div className="relative">
                          <select
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => { setCountry(e.target.value) }}
                            className={`${inputClass} appearance-none pr-10`}
                          >
                            <option value="" disabled>
                              Select Country
                            </option>
                            <option value="IN">India</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>

                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#c3c9b2]">
                            ▾
                          </span>
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </form>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#27272a] bg-[#1c1c1f] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                <motion.button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ backgroundColor: "#353437" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-md border border-[#27272a] px-5 py-2.5 text-sm font-medium text-white transition-colors sm:w-auto"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  form="add-client-form"
                  whileHover={{
                    backgroundColor: "#a4d64c",
                    scale: 1.01,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-md bg-[#bef264] px-5 py-2.5 text-sm font-bold text-[#09090b] transition-colors sm:w-auto"
                >
                  Add Client
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-open button for demo */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-md bg-[#bef264] px-5 py-3 font-bold text-[#09090b] shadow-lg"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Add Client
        </motion.button>
      )}
    </main>
  );
}

/* ---------------------------------------------
   Reusable Components
--------------------------------------------- */

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
};

function FormSection({ title, children }: FormSectionProps) {
  return (
    <section>
      <h3 className="mb-4 border-b border-[#27272a] pb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#c3c9b2]">
        {title}
      </h3>

      {children}
    </section>
  );
}

type FormFieldProps = {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  type?: string;
  mono?: boolean;
  uppercase?: boolean;
};

function FormField({
  label,
  id,
  name,
  placeholder,
  type = "text",
  mono = false,
  uppercase = false,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-[#e5e1e4]">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${inputClass} ${
          mono ? "font-mono text-sm" : ""
        } ${uppercase ? "uppercase" : ""}`}
      />
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded px-4 py-2.5 text-sm ${
        active
          ? "border-l-2 border-[#bef264] bg-[#2a2a2c] font-bold text-[#bef264]"
          : "text-[#c3c9b2]"
      }`}
    >
      <span className="w-5 text-center">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
