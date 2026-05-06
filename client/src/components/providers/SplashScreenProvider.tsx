"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Loader from "@/src/components/Loader";

export default function SplashScreenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const hasVisited = sessionStorage.getItem("penclub_session_initialized");

    if (!hasVisited) {
      setShowSplash(true);
      const startDelay = 600; // Delay before counter starts
      const duration = 2000; // Duration of the counter itself
      const holdTime = 800; // Time to stay at 100%

      const interval = 20;
      const steps = duration / interval;
      const increment = 100 / steps;

      // Start counter after initial delay
      const startTimer = setTimeout(() => {
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + increment;
          });
        }, interval);
      }, startDelay);

      // Total time = startDelay + duration + holdTime
      const totalTimer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("penclub_session_initialized", "true");
      }, startDelay + duration + holdTime);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(totalTimer);
      };
    }
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <Loader key="splash-loader" fullScreen progress={progress} />
        )}
      </AnimatePresence>
      <div className={showSplash ? "hidden" : "block"}>
        {children}
      </div>
    </>
  );
}
