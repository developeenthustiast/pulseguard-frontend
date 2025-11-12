import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseGuard AI - supOS Global Hackathon 2025",
  description: "AI-Enhanced Anomaly Detection System for Smart Manufacturing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}