import { GradientBackground } from "@/components/refund-form/gradient-background";
import { RefundForm } from "@/components/refund-form/refund-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center px-4 py-16">
      <GradientBackground />
      <RefundForm />
    </div>
  );
}
