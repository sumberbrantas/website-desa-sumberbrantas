"use client";

import { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import VideoHero from "@/component/landing-page/VideoHero";
import InfoCards from "@/component/landing-page/InfoCards";
import NewsSection from "@/component/landing-page/NewsSection";
import AgendaSection from "@/component/landing-page/AgendaSection";
import DocumentsSection from "@/component/landing-page/DocumentsSection";
import AccommodationsSection from "@/component/landing-page/AccommodationsSection";
import DestinationsSection from "@/component/landing-page/DestinationsSection";
import ProductsSection from "@/component/landing-page/ProductsSection";
import Footer from "@/component/landing-page/Footer";
import usePageVisitor from "@/hooks/usePageVisitor";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  usePageVisitor("Home");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />
      <VideoHero />
      <InfoCards />
      <NewsSection />
      <AgendaSection />
      <DocumentsSection />
      <AccommodationsSection />
      <DestinationsSection />
      <ProductsSection />
      <Footer />
    </div>
  );
}
