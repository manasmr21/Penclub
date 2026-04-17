"use client";

import dynamic from "next/dynamic";
import Page from "./Page";
import "./Flipbook.css";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
});

export default function FlipBook({ pages }) {
  return (
    <HTMLFlipBook width={400} height={550}>
      {pages.map((src, i) => (
        <Page key={i} src={src} />
      ))}
    </HTMLFlipBook>
  );
}