import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Righteous } from "next/font/google";
import "./globals.css";

const righteous = Righteous({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sarangan Escape Room",
  description: "Game edukasi Aksara Jawa interaktif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Masukkan class font ke dalam tag body */}
      <body className={`${righteous.className} antialiased text-[#3D2B1F] tracking-wide`}>
        {children}
      </body>
    </html>
  );
}
