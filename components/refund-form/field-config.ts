import { z } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "select"
  | "textarea";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  options?: string[];
}

export interface StepConfig {
  title: string;
  fields: FieldConfig[];
}

export const PAYMENT_TYPE_OPTIONS = [
  "Deposit Payment",
  "Value Added Services (VAS) Payment",
  "Others",
];

export const CURRENCY_OPTIONS = ["USD", "INR", "GBP", "EUR", "AUD", "CAD"];

export const REFUND_REASON_OPTIONS = [
  "Visa Rejected",
  "University admission rejected/deferred",
  "Changed university or city",
  "Found alternative accommodation",
  "Cancelling within the cooling-off period",
  "Other",
];

export const STEPS: StepConfig[] = [
  {
    title: "Who are you?",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
      },
      {
        name: "email",
        label: "Email ID used for your booking",
        type: "email",
        placeholder: "john.doe@gmail.com",
      },
    ],
  },
  {
    title: "Booking & payment method",
    fields: [
      {
        name: "transactionId",
        label: "Transaction ID",
        type: "text",
        placeholder: "TXN123456789",
        helperText:
          "You can find your Transaction ID in the payment confirmation email.",
      },
      {
        name: "paymentType",
        label:
          "Please select the payment for which you are requesting a refund",
        type: "select",
        options: PAYMENT_TYPE_OPTIONS,
      },
    ],
  },
  {
    title: "Payment details",
    fields: [
      {
        name: "amountPaid",
        label: "Amount paid",
        type: "number",
        placeholder: "500",
      },
      {
        name: "currency",
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
      { name: "paymentDate", label: "Date of Payment", type: "date" },
    ],
  },
  {
    title: "Tell us more",
    fields: [
      {
        name: "reason",
        label: "Reason for your refund request",
        type: "select",
        options: REFUND_REASON_OPTIONS,
      },
      {
        name: "details",
        label: "Tell us what happened, in your own words",
        type: "textarea",
        placeholder: "Share the details of what happened...",
      },
    ],
  },
];

export const refundFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  transactionId: z.string().min(1, "Transaction ID is required"),
  paymentType: z.string().min(1, "Please select a payment type"),
  amountPaid: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      "Enter a valid amount",
    ),
  currency: z.string().min(1, "Please select a currency"),
  paymentDate: z.string().min(1, "Date of payment is required"),
  reason: z.string().min(1, "Please select a reason"),
  details: z.string().min(1, "Please tell us what happened"),
});

export type RefundFormValues = z.infer<typeof refundFormSchema>;

export const STEP_FIELD_NAMES: (keyof RefundFormValues)[][] = STEPS.map(
  (step) => step.fields.map((f) => f.name as keyof RefundFormValues),
);
