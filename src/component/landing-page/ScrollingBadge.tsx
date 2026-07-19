"use client";

import React from "react";

const ScrollingBadge = () => {
  const badges = ["Transparan", "Informatif", "Melayani"];

  const repeatedBadges = Array(8).fill(badges).flat();

  return (
    <div className="bg-[#1B3A6D] text-white py-2 md:py-3 overflow-hidden w-full">
      <div className="flex animate-scroll">
        {repeatedBadges.map((badge, index) => (
          <div key={index} className="flex items-center whitespace-nowrap text-xs md:text-sm font-semibold flex-shrink-0">
            <span className="text-yellow-400 mx-4 md:mx-8">⭐</span>
            <span className="mx-3 md:mx-4">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBadge;

