import type { RefundFormValues } from "@/components/refund-form/field-config";

const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL ?? "";

export async function submitRefundRequest(
  values: RefundFormValues,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!APPSCRIPT_URL) {
    return { success: false, error: "Missing NEXT_PUBLIC_APPSCRIPT_URL" };
  }

  try {
    const response = await fetch(APPSCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ formType: "refund", ...values }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    if (!data.success) {
      return { success: false, error: data.error ?? "Unknown error" };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
