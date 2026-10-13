import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StudyFlow AI",
    template: "%s | StudyFlow AI",
  },
  description: "AI-powered learning workspace",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          {children}
        </main>
      </body>
    </html>
  );
}
