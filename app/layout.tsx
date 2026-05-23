import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "superzyk.com | AI、开发与 Homelab 笔记",
  description:
    "superzyk 的个人博客，记录 AI Agent、本地 AI、OpenClaw、Hermes、Codex、llama.cpp、开发工具与 Homelab 实践。",
  metadataBase: new URL("https://superzyk.com"),
  openGraph: {
    title: "superzyk.com",
    description:
      "AI Agent、本地 AI、开发工具、Homelab 与网络折腾类个人技术博客。",
    url: "https://superzyk.com",
    siteName: "superzyk.com",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "superzyk.com",
    description:
      "AI Agent、本地 AI、开发工具、Homelab 与网络折腾类个人技术博客。",
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
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
