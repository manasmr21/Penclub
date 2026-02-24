import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Rouge_Script  } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const rougeScript = Rouge_Script({
  subsets: ["latin"],
  weight: "400", // Rogue Script only has 400
  variable: "--font-rouge",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Penclub",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${interFont.variable} ${rougeScript.variable} antialiased`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
