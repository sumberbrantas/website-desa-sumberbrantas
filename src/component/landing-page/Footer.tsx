"use client";

import React, { useState, useEffect } from "react";
import { FiInstagram, FiYoutube, FiPhone, FiMail, FiTwitter, FiFacebook } from "react-icons/fi";
import { useVillageSettings } from "@/hooks/useVillageSettings";

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const { settings } = useVillageSettings();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const villageName = settings?.villageName || "Desa";
  const villageTagline = settings?.villageTagline || "";
  const address = settings?.address || "";
  const email = settings?.email || "";
  const phone = settings?.phone || "";
  const logoUrl = settings?.logoUrl || "/logo.png";

  const socialLinks = settings?.socialLinks || {};
  const instagram = socialLinks.instagram;
  const facebook = socialLinks.facebook;
  const youtube = socialLinks.youtube;
  const tiktok = socialLinks.tiktok;
  const twitter = socialLinks.twitter;

  return (
    <footer className={`text-white smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ backgroundColor: "var(--primary)" }}>
      <div className="max-w-7xl mx-auto px-4 mb-6 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row justify-between items-center md:items-center mb-6 md:mb-4 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <div className="mb-4 flex flex-row md:mb-0 items-center">
            <img
              src={logoUrl || "/logo.png"}
              alt={villageName}
              className="w-20 h-20 md:w-16 md:h-16 object-contain mx-auto md:mx-0 smooth-transition hover:scale-110 animate-float"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>

          <div className="flex flex-row justify-center md:justify-start gap-2 sm:gap-3 w-full md:w-auto">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-2 py-2 border border-white/30 rounded-lg hover:bg-white/10 smooth-transition text-xs md:text-sm hover-lift">
                <FiInstagram size={18} />
              </a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-2 py-2 border border-white/30 rounded-lg hover:bg-white/10 smooth-transition text-xs md:text-sm hover-lift">
                <FiFacebook size={18} />
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-2 py-2 border border-white/30 rounded-lg hover:bg-white/10 smooth-transition text-xs md:text-sm hover-lift">
                <FiYoutube size={18} />
              </a>
            )}
            {tiktok && (
              <a href={tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-2 py-2 border border-white/30 rounded-lg hover:bg-white/10 smooth-transition text-xs md:text-sm hover-lift">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-2 py-2 border border-white/30 rounded-lg hover:bg-white/10 smooth-transition text-xs md:text-sm hover-lift">
                <FiTwitter size={18} />
              </a>
            )}
          </div>
        </div>

        <div className={`relative mb-6 md:mb-3 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          <div className="border-t border-white/30"></div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-6 md:mb-3 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-1 smooth-transition">{villageName}</h3>
            <p className="text-white/90 mb-3 md:mb-2 text-sm md:text-sm smooth-transition">{villageTagline}</p>
            {address && <p className="text-white/80 leading-relaxed text-xs md:text-xs break-words smooth-transition">{address}</p>}
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-2 smooth-transition">Hubungi Kami</h4>
            <div className="space-y-2 md:space-y-1">
              {phone && (
                <div className="flex items-center justify-center md:justify-start hover-lift smooth-transition">
                  <FiPhone size={16} className="mr-3 text-white/80 flex-shrink-0" />
                  <span className="text-white/90 text-sm md:text-sm">{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center justify-center md:justify-start hover-lift smooth-transition">
                  <FiMail size={16} className="mr-3 text-white/80 flex-shrink-0" />
                  <span className="text-white/90 text-sm md:text-sm break-all">{email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`} style={{ backgroundColor: "var(--primary-hover)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <img
                src="/logo-kkn.png"
                alt="Logo"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-white text-[10px] md:text-[10px] mb-[2px] smooth-transition">Dikembangkan oleh Tim KKN FIA UB 2026</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
