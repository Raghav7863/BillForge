"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock, Mail, MoveRight, Phone, User, WalletCards } from "lucide-react";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";

/* ----------------------------- Icons ----------------------------- */

const GoogleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);


/* ----------------------------- Types ----------------------------- */

type Screen = "register" | "otp";

/* ----------------------------- Component ----------------------------- */

export default function registerPage() {
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("register");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("")
  const [userId, setuserId] = useState("");



  const [businessType, setBusinessType] = useState("");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------------- Register -------------------------- */

  const handleregister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    // Replace this with your actual login API.

    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password
    }, { withCredentials: true })

    const userId = response.data.userId;

    setuserId(userId);

    console.log(response.data);

    setLoading(false);

    // Move to onboarding.
    setScreen("otp");
  };

  /* ----------------------- Business Details ----------------------- */

  const handleBusinessContinue = async () => {
    if (!businessName || !businessType) return;

    setLoading(true);

    // Replace with API request to save business information.
    
    await axios.post("/api/auth/onboarding", {
      name,
      email, 
      phone,
      address,
      currency,
    })

    setLoading(false);
    setScreen("otp");
  };

  /* ----------------------------- OTP ----------------------------- */

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length !== 6) return;

    setLoading(true);

    // Replace this with your OTP verification API.
    
    const response = await axios.post("/api/auth/verify-otp", {
      userId: userId,
      otp
    })

     const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (loginResult?.error) {
    console.log(loginResult.error);
    return;
  }

    console.log(response.data);



    setLoading(false);

    // Successful verification.
    router.push("/");
  };

  /* -------------------------- Animation -------------------------- */

  const screenVariants = {
    initial: {
      opacity: 0,
      x: 25,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -25,
    },
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#131315] px-4 py-8 text-[#e5e1e4] sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-[#bff365]/5 blur-[120px]" />

        <div className="absolute -bottom-[20%] -right-[10%] h-[40%] w-[40%] rounded-full bg-[#bff365]/[0.025] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {screen === "register" && (
            <motion.div
              key="register"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-full max-w-[400px]"
            >
              {/* Logo */}
              <div className="mb-8 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <motion.div
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                    }}
                    className="text-[#bff365]"
                  >
                    <WalletCards />
                  </motion.div>

                  <h1 className="text-[32px] font-semibold tracking-[-0.02em]">
                    BillForge
                  </h1>
                </div>

                <p className="text-sm text-[#c3c9b2]">
                  Register to manage your enterprise billing.
                </p>
              </div>

              {/* Register card */}
              <div className="rounded-lg border border-[#353437] bg-[#1c1b1d] p-5 shadow-2xl shadow-black/50 sm:p-6">
                <form onSubmit={handleregister} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block text-sm text-[#c3c9b2]"
                    >
                      Name
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#c3c9b2]">
                        <User />
                      </div>

                      <input
                        id="name"
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="block w-full rounded border border-[#353437] bg-[#131315] py-2 pl-10 pr-3 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#c3c9b2]/50 focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm text-[#c3c9b2]"
                    >
                      Email
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#c3c9b2]">
                        <Mail />
                      </div>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@company.com"
                        className="block w-full rounded border border-[#353437] bg-[#131315] py-2 pl-10 pr-3 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#c3c9b2]/50 focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="password"
                        className="text-sm text-[#c3c9b2]"
                      >
                        Password
                      </label>
                    </div>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#c3c9b2]">
                        <Lock />
                      </div>

                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        required
                        placeholder="••••••••"
                        className="block w-full rounded border border-[#353437] bg-[#131315] py-2 pl-10 pr-3 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#c3c9b2]/50 focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="flex w-full items-center justify-center rounded bg-[#bef264] px-4 py-2 text-sm font-medium text-[#131315] transition hover:bg-[#bff365] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "registering..." : "Register"}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="mt-6 flex items-center">
                  <div className="flex-1 border-t border-[#353437]" />

                  <span className="mx-4 text-sm text-[#c3c9b2]">or</span>

                  <div className="flex-1 border-t border-[#353437]" />
                </div>

                {/* Google */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-[#353437] px-4 py-2 text-sm transition hover:bg-[#2a2a2c]"
                >
                  <GoogleIcon />
                  Continue with Google
                </motion.button>
              </div>

              <p className="mt-6 text-center text-sm text-[#c3c9b2]">
                Already Have an Account?{" "}
                <button className="font-medium text-[#bff365] hover:text-[#a4d64c]">
                  <Link href={"/login"}>
                    Sign In
                  </Link>
                </button>
              </p>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* BUSINESS DETAILS */}
          {/* ========================================================= */}

          {screen === "business" && (
            <motion.div
              key="business"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-full max-w-[520px]"
            >
              {/* Header */}
              <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[#bff365]">
                    <WalletCards />
                  </div>

                  <span className="text-xl font-semibold tracking-tight">
                    BillForge
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setScreen("register")}
                  className="text-sm text-[#c3c9b2] transition hover:text-[#e5e1e4]"
                >
                  Save & Exit
                </button>
              </header>

              {/* Progress */}
              <div className="mb-4 flex flex-col gap-2">
                <div className="flex items-end justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#bff365]">
                    Step 1 of 2
                  </span>

                  <span className="font-mono text-xs text-[#c3c9b2]">
                    Business Details
                  </span>
                </div>

                <div className="flex h-1.5 gap-1 overflow-hidden rounded-full">
                  <div className="flex-1 rounded-full bg-[#bff365]" />
                  <div className="flex-1 rounded-full bg-[#2a2a2c]" />
                </div>
              </div>

              {/* Card */}
              <div className="rounded-xl border border-[#434938] bg-[#1c1b1d] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-8">
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-[32px]">
                    Tell us about your business
                  </h1>

                  <p className="mt-2 text-base leading-7 text-[#c3c9b2]">
                    We'll use this to set up your primary billing workspace and
                    localize your invoices.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Business Name */}
                  <div>
                    <label
                      htmlFor="businessName"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]"
                    >
                      Business Name
                    </label>

                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Food Bites"
                      className="w-full rounded border border-[#434938] bg-[#131315] px-4 py-3 text-sm outline-none transition focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="corebooster88@gmail.com"
                      className="w-full rounded border border-[#434938] bg-[#131315] px-4 py-3 text-sm outline-none transition focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9837289575"
                      className="w-full rounded border border-[#434938] bg-[#131315] px-4 py-3 text-sm outline-none transition focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]"
                    >
                      Business Address
                    </label>

                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="temp address"
                      rows={3}
                      className="w-full resize-none rounded border border-[#434938] bg-[#131315] px-4 py-3 text-sm outline-none transition focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]"
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label
                      htmlFor="currency"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]"
                    >
                      Base Currency
                    </label>

                    <div className="relative">
                      <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full appearance-none rounded border border-[#434938] bg-[#131315] px-4 py-3 text-sm outline-none transition focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="AUD">AUD ($)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>

                  {/* Continue */}
                  <div className="flex justify-end pt-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={
                        !businessName ||
                        !email ||
                        !phone ||
                        !address ||
                        !currency ||
                        loading
                      }
                      onClick={handleBusinessContinue}
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded bg-[#bff365] px-6 py-3 text-sm font-medium text-[#131315] transition hover:bg-[#a4d64c] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {loading ? "Saving..." : "Continue to Verification"}

                      {!loading && <MoveRight />}
                    </motion.button>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-[#c3c9b2]/70">
                Your data is securely encrypted.{" "}
                <button className="underline underline-offset-4 hover:text-[#bff365]">
                  Privacy Policy
                </button>
              </p>
            </motion.div>

          )}

          {/* ========================================================= */}
          {/* OTP SCREEN */}
          {/* ========================================================= */}

          {screen === "otp" && (
            <motion.div
              key="otp"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-full max-w-[440px]"
            >
              {/* Logo */}
              <div className="mb-8 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <div className="text-[#bff365]">
                    <WalletCards />
                  </div>

                  <span className="text-[32px] font-semibold tracking-tight">
                    BillForge
                  </span>
                </div>

                <p className="text-sm text-[#c3c9b2]">
                  Secure account verification
                </p>
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div className="mb-2 flex justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#bff365]">
                    Step 2 of 2
                  </span>

                  <span className="font-mono text-xs text-[#c3c9b2]">
                    Verification
                  </span>
                </div>

                <div className="flex h-1.5 gap-1 overflow-hidden rounded-full">
                  <div className="flex-1 rounded-full bg-[#bff365]" />
                  <div className="flex-1 rounded-full bg-[#bff365]" />
                </div>
              </div>

              <div className="rounded-xl border border-[#353437] bg-[#1c1b1d] p-5 shadow-2xl shadow-black/40 sm:p-8">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#bff365]/10 text-[#bff365]"
                  >
                    <Lock />
                  </motion.div>

                  <h1 className="text-2xl font-semibold">
                    Verify your email
                  </h1>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#c3c9b2]">
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-medium text-[#e5e1e4]">
                      {email || "your email"}
                    </span>
                    .
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="mt-7">
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#c3c9b2]"
                  >
                    Verification Code
                  </label>

                  <input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="w-full rounded border border-[#434938] bg-[#131315] px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] text-[#e5e1e4] outline-none transition focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]"
                  />

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={otp.length !== 6 || loading}
                    type="submit"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#bff365] px-4 py-3 text-sm font-medium text-[#131315] transition hover:bg-[#a4d64c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}

                    {!loading && <MoveRight />}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[#c3c9b2]">
                    Didn't receive the code?
                  </p>

                  <button
                    type="button"
                    className="mt-1 text-sm font-medium text-[#bff365] hover:text-[#a4d64c]"
                  >
                    Resend code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setScreen("business")}
                  className="mt-6 block w-full text-center text-sm text-[#c3c9b2] hover:text-[#e5e1e4]"
                >
                  ← Back to business details
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-[#c3c9b2]/70">
                Your data is securely encrypted.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
