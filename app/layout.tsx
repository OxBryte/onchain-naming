import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { headers } from "next/headers";
import { AppKit } from "@reown/appkit/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnChain Naming - Buy ENS Domains",
  description: "Register and manage ENS domains with custom metadata storage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const headersObj = await headers();
    const cookies = headersObj.get("cookie"); 

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers cookies={cookies}>{children}</Providers>
        <AppKit modal={modal} />
      </body>
    </html>
  );
}
