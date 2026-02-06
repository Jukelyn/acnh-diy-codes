import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Omega ToGo Order Maker",
  description: "Make Omega ToGo Bot orders easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased dark`}
    >
      <TooltipProvider>
        <body className="bg-background text-foreground">{children}</body>
      </TooltipProvider>
    </html>
  );
}
