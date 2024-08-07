import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Clarity from "@/components/Clarity";

const inter = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Image Generator",
  description:
    "Generate images using SDXL and dreamshaper models. Made using Next.js and Cloudflare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {process.env.NODE_ENV === "production" ? <Clarity /> : null}
      <body className={inter.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
