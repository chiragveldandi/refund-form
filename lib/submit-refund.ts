import type { RefundFormValues } from "@/components/refund-form/field-config";

const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL ?? "";

export async function submitRefundRequest(
  values: RefundFormValues,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!APPSCRIPT_URL) {
    return { success: false, error: "Missing NEXT_PUBLIC_APPSCRIPT_URL" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(APPSCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ formType: "refund", ...values }),
      signal: controller.signal,
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
    if (err instanceof DOMException && err.name === "AbortError") {
      return { success: false, error: "Request timed out after 15s" };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
