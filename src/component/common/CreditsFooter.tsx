"use client";

import React from "react";

interface CreditsFooterProps {
  variant?: "light" | "dark";
}

/**
 * Credits Footer - Hardcoded untuk Tim KKN
 * Logo dan teks TIDAK bisa diedit lewat CMS
 * Untuk mengubah, perlu edit langsung di file ini
 */
const CreditsFooter: React.FC<CreditsFooterProps> = ({ variant = "dark" }) => {
  const isDark = variant === "dark";
  const textColor = isDark ? "text-white" : "text-black font-medium";

  return (
    <div className="py-4 md:py-4 smooth-transition" style={isDark ? { backgroundColor: "var(--primary-hover)" } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <img
              src="/logo-kkn.png"
              alt="Logo KKN"
              className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
          <div className="text-center md:text-left">
            <p className={`text-[10px] md:text-[10px] mb-[2px] smooth-transition ${textColor}`}>Dikembangkan oleh Tim KKN FIA UB 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsFooter;
