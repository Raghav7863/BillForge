"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BarChart3, Bell, Building2, ChevronRight, CreditCard, FileText, HelpCircle, LayoutDashboard, Menu, Package, PanelLeftClose, Plus, Receipt, Save, Settings, UploadCloud, User, Users, Wallet, X, Zap,} from "lucide-react";

type FormData = {
  businessName: string;
  phoneNumber: string;
  website: string;
  address: string;
  gstin: string;
};

const initialForm: FormData = {
  businessName: "Acme Corp",
  phoneNumber: "+1 (555) 123-4567",
  website: "https://acmecorp.example.com",
  address: "123 Innovation Drive\nSuite 400\nTech City, TC 90210",
  gstin: "22AAAAA0000A1Z5",
};

const mainNavigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Invoices", icon: FileText },
  { label: "Clients", icon: Users },
  { label: "Products", icon: Package },
  { label: "Payments", icon: Wallet },
  { label: "Recurring", icon: Activity },
  { label: "Analytics", icon: BarChart3 },
];

const footerNavigation = [
  { label: "Settings", icon: Settings },
  { label: "Help", icon: HelpCircle },
];

const settingsTabs = [
  { label: "Business", icon: Building2 },
  { label: "Invoices", icon: Receipt },
  { label: "Payments", icon: CreditCard },
  { label: "Notifications", icon: Bell },
  { label: "Account", icon: User },
];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function BusinessSettingsPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [saved, setSaved] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleDiscard = () => {
    setForm(initialForm);
    setSaved(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#131315] font-sans text-[#e5e1e4] selection:bg-[#bef264] selection:text-[#4b6e00]">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#27272a] bg-[#1c1b1d]/95 px-4 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#bef264]">
            <Zap className="h-5 w-5 fill-[#131315] text-[#131315]" />
          </div>

          <div>
            <h1 className="text-base font-semibold tracking-tight">
              BillForge
            </h1>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
              Enterprise Billing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          className="rounded-md p-2 text-[#c3c9b2] transition-colors hover:bg-[#2a2a2c] hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="fixed bottom-0 left-0 top-0 z-50 flex w-[280px] flex-col border-r border-[#434938] bg-[#1c1b1d] px-4 py-6 md:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[#bef264]">
                    <Zap className="h-5 w-5 fill-[#131315] text-[#131315]" />
                  </div>

                  <div>
                    <h1 className="text-lg font-semibold">BillForge</h1>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      Enterprise Billing
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-md p-2 text-[#c3c9b2] hover:bg-[#2a2a2c]"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </button>
              </div>

              <button className="mb-6 flex w-full items-center justify-center gap-2 rounded bg-[#bef264] px-4 py-2.5 text-sm font-medium text-[#131315] transition hover:bg-[#a4d64c] active:scale-[0.98]">
                <Plus className="h-4 w-4" />
                Create Invoice
              </button>

              <nav className="flex-1 space-y-1">
                {mainNavigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavItem
                      key={item.label}
                      icon={Icon}
                      label={item.label}
                      onClick={() => setMobileNavOpen(false)}
                    />
                  );
                })}
              </nav>

              <div className="space-y-1">
                <NavItem
                  icon={Settings}
                  label="Settings"
                  active
                  onClick={() => setMobileNavOpen(false)}
                />

                <NavItem
                  icon={HelpCircle}
                  label="Help"
                  onClick={() => setMobileNavOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-h-screen md:ml-[260px]">
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[1280px] px-4 pb-10 pt-24 sm:px-6 md:pt-10 lg:px-8 lg:py-10"
        >
          {/* Page Header */}
          <motion.header variants={itemVariants} className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm text-[#c3c9b2]">
              <span>Settings</span>

              <ChevronRight className="h-4 w-4" />

              <span className="text-[#e5e1e4]">Business Profile</span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#e5e1e4] sm:text-4xl">
              Settings
            </h2>
          </motion.header>

          <div className="flex flex-col gap-6 md:flex-row">
            {/* Settings Tabs */}
            <motion.aside
              variants={itemVariants}
              className="w-full shrink-0 md:w-64"
            >
              <nav className="flex gap-1 overflow-x-auto rounded-lg border border-[#27272a] bg-[#1c1b1d] p-2 md:block md:space-y-1">
                {settingsTabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const active = index === 0;

                  return (
                    <motion.button
                      key={tab.label}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      className={[
                        "flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors md:w-full",
                        active
                          ? "bg-[#27272a] font-medium text-[#bff365]"
                          : "text-[#c3c9b2] hover:bg-[#1c1c1f] hover:text-[#e5e1e4]",
                      ].join(" ")}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={active ? 2.2 : 1.8}
                      />

                      {tab.label}
                    </motion.button>
                  );
                })}
              </nav>
            </motion.aside>

            {/* Form */}
            <motion.div
              variants={pageVariants}
              className="min-w-0 flex-1 space-y-6"
            >
              {/* Business Details */}
              <motion.section
                variants={itemVariants}
                className="overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b]"
              >
                <SectionHeader
                  title="Business Details"
                  description="Basic information about your organization."
                />

                <div className="space-y-6 p-5 sm:p-6">
                  <div className="flex flex-col items-start gap-6 sm:flex-row">
                    {/* Logo */}
                    <div className="w-full sm:w-auto">
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
                        Logo
                      </label>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="group flex h-24 w-24 flex-col items-center justify-center rounded-lg border border-dashed border-[#27272a] bg-[#09090b] text-[#c3c9b2] transition-colors hover:border-[#bff365] hover:text-[#bff365]"
                      >
                        <UploadCloud className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />

                        <span className="mt-1 text-[10px]">Upload</span>
                      </motion.button>
                    </div>

                    {/* Business Name */}
                    <div className="w-full flex-1">
                      <FormLabel htmlFor="businessName">
                        Business Name
                      </FormLabel>

                      <TextInput
                        id="businessName"
                        value={form.businessName}
                        onChange={(value) =>
                          updateField("businessName", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Contact Information */}
              <motion.section
                variants={itemVariants}
                className="overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b]"
              >
                <SectionHeader
                  title="Contact Information"
                  description="Where clients can reach you."
                />

                <div className="space-y-6 p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <FormLabel htmlFor="phoneNumber">
                        Phone Number
                      </FormLabel>

                      <TextInput
                        id="phoneNumber"
                        type="tel"
                        mono
                        value={form.phoneNumber}
                        onChange={(value) =>
                          updateField("phoneNumber", value)
                        }
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="website">Website</FormLabel>

                      <TextInput
                        id="website"
                        type="url"
                        value={form.website}
                        onChange={(value) => updateField("website", value)}
                      />
                    </div>
                  </div>

                  <div>
                    <FormLabel htmlFor="address">Address</FormLabel>

                    <textarea
                      id="address"
                      rows={3}
                      value={form.address}
                      onChange={(e) =>
                        updateField("address", e.target.value)
                      }
                      className="w-full resize-none rounded border border-[#27272a] bg-[#09090b] p-2 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#71717a] focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]/20"
                    />
                  </div>
                </div>
              </motion.section>

              {/* Tax Information */}
              <motion.section
                variants={itemVariants}
                className="overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b]"
              >
                <SectionHeader
                  title="Tax Information"
                  description="Required for accurate invoicing."
                />

                <div className="p-5 sm:p-6">
                  <div className="w-full max-w-md">
                    <FormLabel htmlFor="gstin">GSTIN / Tax ID</FormLabel>

                    <TextInput
                      id="gstin"
                      mono
                      value={form.gstin}
                      onChange={(value) => updateField("gstin", value)}
                      className="tracking-wider"
                    />
                  </div>
                </div>
              </motion.section>

              {/* Actions */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col-reverse gap-3 border-t border-[#27272a] pt-5 sm:flex-row sm:justify-end"
              >
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDiscard}
                  className="rounded border border-[#27272a] bg-transparent px-4 py-2 text-sm text-[#fafafa] transition-colors hover:bg-[#1c1c1f]"
                >
                  Discard
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 rounded bg-[#bef264] px-6 py-2 text-sm font-medium text-[#131315] shadow-[0_0_15px_rgba(190,242,100,0.1)] transition-colors hover:bg-[#a4d64c]"
                >
                  <Save className="h-4 w-4" />

                  {saved ? "Saved!" : "Save Changes"}
                </motion.button>
              </motion.div>

              {/* Save notification */}
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="fixed bottom-5 right-5 z-50 rounded-lg border border-[#4b6e00] bg-[#1c1b1d] px-4 py-3 text-sm text-[#bff365] shadow-2xl"
                  >
                    Business settings saved successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed bottom-0 left-0 top-0 z-50 hidden w-[260px] flex-col border-r border-[#434938] bg-[#1c1b1d] py-6 md:flex"
    >
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-6">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="flex h-8 w-8 items-center justify-center rounded bg-[#bef264]"
        >
          <Zap className="h-5 w-5 fill-[#131315] text-[#131315]" />
        </motion.div>

        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#e5e1e4]">
            BillForge
          </h1>

          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]">
            Enterprise Billing
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mb-6 px-6">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded bg-[#bef264] px-4 py-2 text-sm font-medium text-[#131315] transition-colors hover:bg-[#a4d64c]"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </motion.button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {mainNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavItem
                key={item.label}
                icon={Icon}
                label={item.label}
              />
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-1">
        {footerNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavItem
              key={item.label}
              icon={Icon}
              label={item.label}
              active={item.label === "Settings"}
            />
          );
        })}
      </div>
    </motion.aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 border-l-2 px-4 py-2 text-left text-sm transition-colors",
        active
          ? "border-[#bff365] bg-[#454747] text-[#b4b5b5]"
          : "border-transparent text-[#c3c9b2] hover:bg-[#2a2a2c] hover:text-[#e5e1e4]",
      ].join(" ")}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </motion.button>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[#27272a] px-5 py-4 sm:px-6">
      <h3 className="text-xl font-medium tracking-tight text-[#e5e1e4]">
        {title}
      </h3>

      <p className="mt-1 text-sm text-[#c3c9b2]">{description}</p>
    </div>
  );
}

function FormLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#c3c9b2]"
    >
      {children}
    </label>
  );
}

function TextInput({
  id,
  value,
  onChange,
  type = "text",
  mono = false,
  className = "",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        "w-full rounded border border-[#27272a] bg-[#09090b] p-2 text-sm text-[#e5e1e4] outline-none transition-all",
        "focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]/20",
        mono ? "font-mono" : "",
        className,
      ].join(" ")}
    />
  );
}
