"use client";

import { useEffect, useRef } from "react";

export const usePageVisitor = (pageName?: string) => {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (hasTrackedRef.current) return;

    const trackPageVisit = async () => {
      try {
        const { updateVisitorStats } = await import("@/lib/visitorService");

        await updateVisitorStats();
        hasTrackedRef.current = true;
      } catch (error) {
        console.error("Error tracking page visit:", error);
        hasTrackedRef.current = false;
      }
    };

    const timer = setTimeout(trackPageVisit, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [pageName]);

  useEffect(() => {
    return () => {
      hasTrackedRef.current = false;
    };
  }, []);
};

export default usePageVisitor;

