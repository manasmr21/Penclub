"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface MainWrapperProps {
  children: React.ReactNode;
}

export default function MainWrapper({ children }: MainWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // When not on the home page, add top padding to account for the fixed navbar height
  return (
    <main className={`flex-1 bg-[#FDF9F0] ${!isHomePage ? "pt-[38px] md:pt-[53px]" : ""}`}>
      {children}
    </main>
  );
}
