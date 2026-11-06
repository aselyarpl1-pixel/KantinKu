import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Aplikasi pemesanan makanan KantinKu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Suspense
          fallback={
            <nav className="navbar">
              <span className="navbar-logo">KantinKu</span>
            </nav>
          }
        >
          <Navbar />
        </Suspense>

        <main>{children}</main>
      </body>
    </html>
  );
}
