"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  refundFormSchema,
  STEPS,
  STEP_FIELD_NAMES,
  type RefundFormValues,
} from "./field-config";
import { FieldRenderer } from "./field-renderer";
import { SuccessScreen } from "./success-screen";
import { BrandLogo } from "./brand-logo";
import { submitRefundRequest } from "@/lib/submit-refund";

const RETRY_COOLDOWN_SECONDS = 5 * 60;

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RefundForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCooldown((c) => Math.max(c - 1, 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cooldown]);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RefundFormValues>({
    resolver: zodResolver(refundFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      transactionId: "",
      paymentType: "",
      amountPaid: "",
      currency: "",
      paymentDate: "",
      reason: "",
      details: "",
    },
  });

  const isLastStep = stepIndex === STEPS.length - 1;
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = async () => {
    const valid = await trigger(STEP_FIELD_NAMES[stepIndex]);
    if (!valid) return;
    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const onSubmit = async (values: RefundFormValues) => {
    setStatus("submitting");
    const result = await submitRefundRequest(values);
    if (result.success) {
      setSubmitted(true);
      setStatus("idle");
    } else {
      setStatus("error");
      setCooldown(RETRY_COOLDOWN_SECONDS);
    }
  };

  const currentStep = STEPS[stepIndex];
  const canRetry = status === "error" && cooldown === 0;
  const sendDisabled = status === "submitting" || (status === "error" && cooldown > 0);

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {!submitted && (
        <>
          <div
            aria-hidden
            className="absolute inset-x-6 -top-3 h-full rounded-3xl bg-white/50 shadow-sm"
            style={{ transform: "rotate(-3deg)" }}
          />
          <div
            aria-hidden
            className="absolute inset-x-4 -top-1.5 h-full rounded-3xl bg-white/70 shadow-sm"
            style={{ transform: "rotate(2deg)" }}
          />
        </>
      )}

      <div className="relative rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <BrandLogo />

        {!submitted && (
          <div className="mb-8 flex items-center gap-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-brand-coral"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {submitted ? (
          <SuccessScreen />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={stepIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Step {stepIndex + 1} of {STEPS.length}
                </p>
                <h2 className="mb-6 text-2xl font-bold leading-snug text-brand-navy">
                  {currentStep.title}
                </h2>

                <div className="space-y-5">
                  {currentStep.fields.map((field) => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      control={control}
                      errors={errors}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {status === "error" && (
              <div className="mt-6 rounded-xl border border-brand-coral/30 bg-brand-coral/5 px-4 py-3 text-sm text-brand-coral">
                We couldn&apos;t submit your request. Please wait a few minutes and try again.
                {cooldown > 0 && (
                  <span className="ml-1 font-semibold">
                    You can retry in {formatCountdown(cooldown)}.
                  </span>
                )}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="text-sm font-semibold text-slate-500 transition-opacity hover:text-slate-700 disabled:opacity-0"
              >
                Back
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={sendDisabled}
                  className="rounded-xl bg-brand-coral px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-coral/20 transition-colors hover:bg-brand-coral/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "submitting"
                    ? "Sending..."
                    : status === "error" && cooldown > 0
                      ? `Retry in ${formatCountdown(cooldown)}`
                      : canRetry
                        ? "Try again"
                        : "Send"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-xl bg-brand-coral px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-coral/20 transition-colors hover:bg-brand-coral/90"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
