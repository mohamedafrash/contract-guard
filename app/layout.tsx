import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Contract Guard",
  description: "Automated Contract Compliance Analysis",
};

function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen transition-colors duration-300"
        suppressHydrationWarning
      >
        <Suspense fallback={<Loading />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
