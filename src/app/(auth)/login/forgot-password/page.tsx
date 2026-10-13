"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  RotateCcw,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Check,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

type FlowStep = "EMAIL_REQUEST" | "OTP_VERIFY" | "NEW_PASSWORD" | "SUCCESS";

const STEPS = [
  { id: "EMAIL_REQUEST", label: "Email", number: 1 },
  { id: "OTP_VERIFY", label: "Verify", number: 2 },
  { id: "NEW_PASSWORD", label: "Password", number: 3 },
];

export default function PasswordResetFlow() {
  const [resetToken, setResetToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<FlowStep>("EMAIL_REQUEST");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Current step index
  const currentStepIndex =
    step === "EMAIL_REQUEST"
      ? 0
      : step === "OTP_VERIFY"
        ? 1
        : step === "NEW_PASSWORD"
          ? 2
          : 3;

  // Progress percentage (0%, 50%, 100%)
  const progressPercent =
    step === "EMAIL_REQUEST"
      ? 0
      : step === "OTP_VERIFY"
        ? 50
        : 100;

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      while (newOtp.length < 6) newOtp.push("");
      setOtp(newOtp);
      otpRefs.current[Math.min(pasteData.length, 5)]?.focus();
    }
  };

  // Form Submissions
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/forgot-password", {
        action: "REQUEST_OTP",
        email
      });

      const data = res.data;

      setStep("OTP_VERIFY");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/forgot-password", {
        action: "VERIFY_OTP", 
        email,
        otp: otp.join("")
      });

      const data = res.data;

      setResetToken(data.resetToken); // Save temporary JWT token
      setStep("NEW_PASSWORD");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/forgot-password", {
        action: "RESET_PASSWORD",
        resetToken,
        newPassword: password,
      });

      const data = res.data;

      setStep("SUCCESS");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="dark bg-[#131315] text-[#e5e1e4] min-h-screen flex flex-col justify-between selection:bg-[#bef264] selection:text-[#4b6e00] font-sans">
      {/* Header */}
      <header className="w-full py-6 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#201f22] flex items-center justify-center text-[#bef264] shadow-sm">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-[#e5e1e4]">
            BillForge
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col w-full max-w-xl mx-auto py-2">
          <div className="w-full max-w-md mx-auto space-y-6">

            {/* STEP BAR / PROGRESS INDICATOR */}
            <div className="bg-[#1c1b1d] border border-[#353437]/60 rounded-xl p-5 shadow-md">
              <div className="relative">

                {/* VERTICALLY CENTERED PROGRESS BAR CONTAINER */}
                <div className="absolute top-4 left-4 right-4 h-1 flex items-center -translate-y-1/2 z-0">
                  {/* Gray Track */}
                  <div className="w-full h-1 bg-[#353437] rounded-full" />

                  {/* Active Green Line */}
                  <motion.div
                    className="absolute left-0 h-1 bg-[#bef264] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>

                {/* Step Icons & Labels */}
                <div className="relative z-10 flex items-start justify-between">
                  {STEPS.map((s, idx) => {
                    const isCompleted = currentStepIndex > idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={s.id} className="flex flex-col items-center">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.05 : 1,
                            backgroundColor: isCompleted || isCurrent ? "#bef264" : "#201f22",
                            borderColor: isCompleted || isCurrent ? "#bef264" : "#353437",
                            color: isCompleted || isCurrent ? "#131f00" : "#c3c9b2",
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-md"
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span>{s.number}</span>
                          )}
                        </motion.div>

                        <span
                          className={`text-[11px] font-semibold tracking-wider uppercase mt-2 transition-colors ${isCurrent
                            ? "text-[#bef264]"
                            : isCompleted
                              ? "text-[#e5e1e4]"
                              : "text-[#c3c9b2]/60"
                            }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="bg-[#1c1b1d] border border-[#353437]/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {/* STEP 1: EMAIL REQUEST */}
                {step === "EMAIL_REQUEST" && (
                  <motion.div
                    key="step-email"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-[#353437] flex items-center justify-center text-[#bef264] shadow-md">
                        <RotateCcw className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#e5e1e4]">
                          Reset password
                        </h1>
                        <p className="text-sm text-[#c3c9b2] leading-relaxed max-w-xs mx-auto">
                          Enter your work email address and we'll send you a verification code to reset your password.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSendEmail} className="space-y-5">
                      {error && (
                        <p className="text-xs text-red-400 text-center bg-red-950/40 p-2 rounded border border-red-800/50">
                          {error}
                        </p>
                      )}
                      <div className="space-y-2">
                        <label
                          htmlFor="recovery-email"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]"
                        >
                          Work Email Address
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3.5 text-[#c3c9b2] w-5 h-5 pointer-events-none" />
                          <input
                            id="recovery-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full bg-[#0e0e10] text-[#e5e1e4] pl-11 pr-4 py-3 rounded-lg text-sm outline-none border border-[#353437] focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all placeholder:text-[#353437]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg bg-[#bef264] text-[#4b6e00] font-semibold text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Send Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="pt-2 text-center">
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#c3c9b2] hover:text-[#e5e1e4] transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to sign in</span>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: OTP VERIFICATION */}
                {step === "OTP_VERIFY" && (
                  <motion.div
                    key="step-otp"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-[#353437] flex items-center justify-center text-[#bef264] shadow-md">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#e5e1e4]">
                          Check your email
                        </h1>
                        <p className="text-sm text-[#c3c9b2] leading-relaxed max-w-xs mx-auto">
                          We sent a 6-digit verification code to{" "}
                          <span className="font-medium text-[#e5e1e4]">{email}</span>
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      {error && (
                        <p className="text-xs text-red-400 text-center bg-red-950/40 p-2 rounded border border-red-800/50">
                          {error}
                        </p>
                      )}

                      <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#0e0e10] text-[#e5e1e4] rounded-lg border border-[#353437] focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] outline-none transition-all"
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg bg-[#bef264] text-[#4b6e00] font-semibold text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Verify Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="pt-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                      <button
                        type="button"
                        onClick={() => setStep("EMAIL_REQUEST")}
                        className="inline-flex items-center gap-1 hover:text-[#e5e1e4] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Change Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtp(["", "", "", "", "", ""])}
                        className="hover:text-[#bef264] transition-colors cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === "NEW_PASSWORD" && (
                  <motion.div
                    key="step-password"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-[#353437] flex items-center justify-center text-[#bef264] shadow-md">
                        <KeyRound className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#e5e1e4]">
                          Set new password
                        </h1>
                        <p className="text-sm text-[#c3c9b2] leading-relaxed max-w-xs mx-auto">
                          Your new password must be at least 8 characters long.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                      {error && (
                        <p className="text-xs text-red-400 text-center bg-red-950/40 p-2 rounded border border-red-800/50">
                          {error}
                        </p>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                          New Password
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-3.5 text-[#c3c9b2] w-5 h-5 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#0e0e10] text-[#e5e1e4] pl-11 pr-4 py-3 rounded-lg text-sm outline-none border border-[#353437] focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all placeholder:text-[#353437]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#c3c9b2]">
                          Confirm Password
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-3.5 text-[#c3c9b2] w-5 h-5 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#0e0e10] text-[#e5e1e4] pl-11 pr-4 py-3 rounded-lg text-sm outline-none border border-[#353437] focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all placeholder:text-[#353437]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg bg-[#bef264] text-[#4b6e00] font-semibold text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        <span>Reset Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === "SUCCESS" && (
                  <motion.div
                    key="step-success"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8 text-center"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-[#bef264]/20 flex items-center justify-center text-[#bef264] shadow-md border border-[#bef264]/30">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#e5e1e4]">
                          Password reset!
                        </h1>
                        <p className="text-sm text-[#c3c9b2] leading-relaxed max-w-xs mx-auto">
                          Your password has been successfully updated. You can now log in with your new credentials.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/login"
                      className="w-full py-3 px-4 rounded-lg bg-[#bef264] text-[#4b6e00] font-semibold text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-[#c3c9b2] tracking-wider">
            © 2024 BillForge Financial Technologies Inc.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#c3c9b2] hover:text-[#e5e1e4] tracking-wider transition-colors">
              Help
            </a>
            <a href="#" className="text-xs text-[#c3c9b2] hover:text-[#e5e1e4] tracking-wider transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-[#c3c9b2] hover:text-[#e5e1e4] tracking-wider transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}