"use client";

import React, { useState, useEffect } from "react";
import { usePublishedArticles } from "@/hooks/useArticles";
import { useActiveAnnouncements } from "@/hooks/useAnnouncements";
import NewsContent from "./NewsContent";
import AnnouncementsContent from "./AnnouncementsContent";

const NewsSection = () => {
  const [mounted, setMounted] = useState(false);
  const { articles, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = usePublishedArticles(4);
  const { announcements: activeAnnouncements, loading: announcementsLoading, error: announcementsError, refetch: refetchAnnouncements } = useActiveAnnouncements(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`py-12 md:py-16 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          <div className={`lg:col-span-2 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <h2 className="text-xl md:text-2xl font-bold text-earth-dark mb-6 md:mb-8 smooth-transition">Berita</h2>
            <NewsContent 
              articles={articles}
              articlesLoading={articlesLoading}
              articlesError={articlesError}
              refetchArticles={refetchArticles}
              mounted={mounted}
            />
          </div>


          <div className={`lg:col-span-1 mt-8 lg:mt-0 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <h3 className="text-xl md:text-2xl font-bold text-earth-dark mb-6 md:mb-8 smooth-transition">Pengumuman</h3>
            <AnnouncementsContent 
              activeAnnouncements={activeAnnouncements}
              announcementsLoading={announcementsLoading}
              announcementsError={announcementsError}
              refetchAnnouncements={refetchAnnouncements}
              mounted={mounted}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;


