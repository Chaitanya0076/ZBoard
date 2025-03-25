import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "ZBoard",
  description: "This is a SAAS application where users can manage theirs projects and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} dotted-background`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors/>
          <footer className="bg-gray-700 py-3 px-2">
            <div className="container mx-auto text-white flex justify-between items-center">
              <p>© 2025 ZBoard</p>
              <p>By Chaitanya</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
