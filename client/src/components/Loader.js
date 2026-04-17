"use client";

import Image from "next/image";
import "../app/(main)/globals.css";

export default function Loader({ fullScreen = false }) {
  return (
    <div className={fullScreen ? "loader-overlay" : "loader-inline"}>
      <Image
        src="/bookload.gif" 
        alt="Loading..."
        width={120}
        height={120}
      />
    </div>
  );
}