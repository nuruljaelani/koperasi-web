import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UPK Mekarsari - Koperasi Simpan Pinjam Terpercaya",
  description:
    "UPK Mekarsari adalah koperasi yang berkomitmen untuk kesejahteraan anggota melalui layanan finansial yang terpercaya dan menguntungkan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
