import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Clarity from "@/components/Clarity";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Image Generator",
  description:
    "Generate images using SDXL, Flux Schnell, Leonardo and dreamshaper models. Made using Next.js and Cloudflare.",
  metadataBase: new URL("https://img-gen7.netlify.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {process.env.NODE_ENV === "production" ? <Clarity /> : null}
      <body className={sora.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
