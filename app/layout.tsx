import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Refund Request | UniAcco",
  description: "Submit a refund request for your UniAcco booking",

  icons: {
    icon: "https://uniacco.imgix.net/site-static/v2/uniacco/logo.svg",
  },

  openGraph: {
    title: "Refund Request | UniAcco",
    description: "Submit a refund request for your UniAcco booking",
    images: [
      {
        url: "https://uniacco.imgix.net/site-static/v2/uniacco/logo.svg",
        width: 1200,
        height: 630,
        alt: "UniAcco Refund Request",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
