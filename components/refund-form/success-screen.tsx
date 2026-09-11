"use client";

import { motion } from "framer-motion";

export function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center px-2 py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-emerald-500"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </motion.div>
      <h2 className="text-2xl font-bold text-slate-900">Refund request submitted</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
        Thanks for letting us know. Our team will review your request and get back to you at the
        email address you provided within 3–5 business days.
      </p>
      <p className="mt-4 max-w-sm rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium leading-relaxed text-slate-600">
        You will receive a confirmation email within 5 minutes. If no email is received, please
        submit the form again.
      </p>
    </motion.div>
  );
}
