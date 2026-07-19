"use client";

import React, { useState, useEffect } from "react";
import InfoCard from "./InfoCard";
import { useInfoCardsData } from "@/hooks/useInfoCardsData";

const InfoCards = () => {
  const [mounted, setMounted] = useState(false);
  const { cardData } = useInfoCardsData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`py-8 md:py-10 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ backgroundColor: "var(--background-alt)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 md:gap-6">
          {cardData.map((card, index) => (
            <InfoCard
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              index={index}
              mounted={mounted}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
