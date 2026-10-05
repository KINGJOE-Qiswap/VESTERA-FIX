import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { Manrope, Fraunces } from "next/font/google";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

const vstSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vst-sans",
});
const vstDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vst-display",
});

export const metadata: Metadata = {
  title: "Made with App Studio",
  description: "VESTERA — the Pi property marketplace priced in Pi at Global Consensus Value.",
    generator: 'v0.app'
};

export const viewport: Viewport = {
  themeColor: "#1f6a55",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vstSans.variable} ${vstDisplay.variable} ${GeistMono.variable}`}
    >
      <body className="bg-background">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
