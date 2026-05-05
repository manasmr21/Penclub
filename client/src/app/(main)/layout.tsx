import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Rouge_Script, Chau_Philomene_One, Quicksand, Noto_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "./(homepage)/Footer";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700", "900"],
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chauPhilomene = Chau_Philomene_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chau",
  display: "swap",
});

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rougeScript = Rouge_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rouge",
  display: "swap",
});

const quickSand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Penclub",
  description: "",
  icons: {
    icon: "/images/favicon.ico",
  },
};

import SplashScreenProvider from "@/src/components/providers/SplashScreenProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SplashScreenProvider>
      <div
        className={`${geistSans.variable} ${geistMono.variable} ${interFont.variable} ${rougeScript.variable} ${chauPhilomene.variable} ${quickSand.variable} ${notoSerif.variable} min-h-screen flex flex-col antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SplashScreenProvider>
  );
}
