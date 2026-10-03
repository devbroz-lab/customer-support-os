import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { DemoProvider } from "@/components/demo-provider";
import { ProductTourProvider } from "@/components/product-tour";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "Devbroz SupportOS", description: "AI-powered customer operations workspace" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}><body className="min-h-screen"><DemoProvider><ProductTourProvider><Sidebar /><main className="min-h-screen pl-0 lg:pl-72">{children}</main></ProductTourProvider></DemoProvider><Toaster position="top-right" richColors /></body></html>;
}
