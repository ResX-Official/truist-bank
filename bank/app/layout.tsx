import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trust Bank — Banking Reimagined",
  description:
    "Experience the future of finance. Secure, instant banking with seamless transfers, AI-powered insights, and wealth management built for your ambitions.",
  keywords: ["banking", "fintech", "digital bank", "online banking", "Trust Bank"],
};

const RTL_LOCALES = ["ar", "he"];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    // fallback for non-locale routes (e.g. /api/*)
  }
  const isRTL = RTL_LOCALES.includes(locale);

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body className={`${sora.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
