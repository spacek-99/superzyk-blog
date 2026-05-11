import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "superzyk.com | AI、开发与 Homelab 笔记",
  description:
    "superzyk 的个人博客，记录 AI 工程、开发工具、Homelab、网络折腾和长期维护经验。",
  openGraph: {
    title: "superzyk.com",
    description:
      "AI、开发、Homelab 与网络折腾类个人技术博客。",
    url: "https://superzyk.com",
    siteName: "superzyk.com",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "superzyk.com",
    description:
      "AI、开发、Homelab 与网络折腾类个人技术博客。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
