"use client"
import React, { FormEvent } from "react";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";

const MailIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const WalletIcon = () => (
  <svg
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h14v2H5a5 5 0 0 1 0-10h12a4 4 0 0 1 4 4v2h-2Z" />
    <path d="M19 7h-2a3 3 0 0 0 0 6h2v3a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a3 3 0 0 0 3 3h14V7Zm-2 4a1 1 0 1 0 0 2h1v-2h-1Z" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
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

export default function page() {

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    console.log({
      email,
      password,
    });

    // Add your authentication API call here.

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log(result);

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#131315] px-4 py-8 text-[#e5e1e4] selection:bg-[#bef264] selection:text-[#233600] sm:px-6">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="w-full max-w-[400px]"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8 text-center"
          >
            <div className="mb-2 flex items-center justify-center gap-2">
              <motion.div
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.45,
                  type: "spring",
                  stiffness: 200,
                }}
                className="text-[#bff365]"
              >
                <WalletIcon />
              </motion.div>

              <h1 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.02em]">
                BillForge
              </h1>
            </div>

            <p className="text-sm leading-[1.5] text-[#c3c9b2]">
              Sign in to manage your enterprise billing.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.45,
            }}
            className="rounded-lg border border-[#353437] bg-[#1c1b1d] p-5 shadow-2xl shadow-black/50 sm:p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm leading-[1.5] text-[#c3c9b2]"
                >
                  Email
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#c3c9b2]">
                    <MailIcon />
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="block w-full rounded border border-[#353437] bg-[#131315] py-2 pl-10 pr-3 text-sm text-[#e5e1e4] outline-none transition-all duration-200 placeholder:text-[#c3c9b2]/50 focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm leading-[1.5] text-[#c3c9b2]"
                  >
                    Password
                  </label>

                  <Link
                    href="/login/forgot-password"
                    className="text-sm text-[#bff365] transition-colors hover:text-[#a4d64c]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#c3c9b2]">
                    <LockIcon />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="block w-full rounded border border-[#353437] bg-[#131315] py-2 pl-10 pr-3 text-sm text-[#e5e1e4] outline-none transition-all duration-200 placeholder:text-[#c3c9b2]/50 focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
                  />
                </div>
              </div>

              {/* Sign In */}
              <motion.button
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 0 20px rgba(190, 242, 100, 0.12)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded bg-[#bef264] px-4 py-2 text-sm font-medium text-[#131315] transition-colors duration-200 hover:bg-[#bff365] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:ring-offset-2 focus:ring-offset-[#1c1b1d]"
              >
                Sign in
              </motion.button>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="flex-grow border-t border-[#353437]" />

              <span className="mx-4 flex-shrink-0 text-sm text-[#c3c9b2]">
                or
              </span>

              <div className="flex-grow border-t border-[#353437]" />
            </div>

            {/* Google */}
            <motion.button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              whileHover={{
                scale: 1.01,
                backgroundColor: "rgba(42, 42, 44, 0.7)",
              }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-[#353437] bg-transparent px-4 py-2 text-sm text-[#e5e1e4] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#bef264]"
            >
              <GoogleIcon />
              Continue with Google
            </motion.button>
          </motion.div>

          {/* Create account */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 text-center text-sm text-[#c3c9b2]"
          >
            New to BillForge?{" "}
            <Link
              href="/register"
              className="font-medium text-[#bff365] transition-colors hover:text-[#a4d64c]"
            >
              Create account
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
