"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Page from "./Page";
import "./Flipbook.css";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
});

export default function FlipBook({ pages }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="book-container">
      <div className="flipbook-wrapper">
        <button
          className="close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close flipbook"
        >
          ✕
        </button>

        <HTMLFlipBook width={400} height={550}>
          {pages.map((src, i) => (
            <Page key={i} src={src} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}