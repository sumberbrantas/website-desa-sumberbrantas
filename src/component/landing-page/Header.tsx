"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiBarChart, FiHome, FiInfo, FiFileText, FiBell, FiUsers, FiFilePlus, FiImage, FiMapPin, FiMap, FiPhone, FiMail, FiGlobe, FiShoppingBag, FiCoffee, FiStar, FiHeart, FiAward, FiBook, FiBriefcase, FiCompass, FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import UserDropdown from "@/component/common/UserDropdown";
import { confirmLogout, showError } from "@/utils/confirmationUtils";
import { useVillageSettings } from "@/hooks/useVillageSettings";
import { useMenus } from "@/hooks/useMenus";

// Icon mapping
const iconMap: Record<string, any> = {
  FiHome, FiInfo, FiFileText, FiBell, FiUsers, FiFilePlus, FiImage, FiMapPin, FiMap, FiPhone, FiMail, FiGlobe, FiShoppingBag, FiCoffee, FiStar, FiHeart, FiAward, FiBook, FiBriefcase, FiCompass,
};

// Number of visible menu items before hamburger
const DESKTOP_VISIBLE_MENU_COUNT = 5;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, profile, loading: authLoading } = useAuth();
  const { logout } = useAuthActions();
  const { settings } = useVillageSettings();
  const { menus } = useMenus(true); // Only active menus

  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (confirmed) {
      try {
        await logout();
        setIsMenuOpen(false);
      } catch (error) {
        console.error("Error logging out:", error);
        showError("Terjadi kesalahan saat logout");
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [isMenuOpen]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const villageName = settings?.villageName || "Desa";
  const villageTagline = settings?.villageTagline || "";
  const logoUrl = settings?.logoUrl || "/logo.png";

  // Filter only active menus
  const activeMenus = menus.filter(menu => menu.isActive);

  // Split menus for desktop: visible and "More" dropdown
  const visibleMenus = activeMenus.slice(0, DESKTOP_VISIBLE_MENU_COUNT);
  const moreMenus = activeMenus.slice(DESKTOP_VISIBLE_MENU_COUNT);

  const isActivePath = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const getNavLinkClass = (href: string, isMobile: boolean = false) => {
    const baseClass = isMobile ? "navbar-link text-gray-700 px-3 py-3 text-sm font-medium rounded-md transition-all duration-300" : "navbar-link text-gray-700 px-4 py-2 text-sm font-medium rounded-md";
    const activeClass = isMobile ? "active-mobile" : "active";
    const isActive = isActivePath(href);
    return `${baseClass} ${isActive ? activeClass : ""}`;
  };

  // Render icon
  const renderIcon = (iconName: string | undefined, className: string = "") => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  return (
    <header className={`bg-white sticky shadow-sm top-0 z-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"} ${isScrolled ? "shadow-md" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Name */}
          <div className={`flex items-center smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <div className="navbar-logo">
              <img
                src={logoUrl || "/logo.png"}
                alt={villageName}
                className="h-10 w-10 object-contain smooth-transition"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900 smooth-transition">{villageName}</h1>
              <p className="text-xs text-gray-500 smooth-transition">{villageTagline}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden xl:flex items-center space-x-1 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            {visibleMenus.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.targetBlank ? "_blank" : undefined}
                rel={item.targetBlank ? "noopener noreferrer" : undefined}
                className={getNavLinkClass(item.href)}
                style={{ animationDelay: `${(index + 2) * 0.05}s` }}
              >
                <span className="flex items-center gap-1.5">
                  {renderIcon(item.icon)}
                  {item.name}
                </span>
              </Link>
            ))}

            {/* More Dropdown Menu */}
            {moreMenus.length > 0 && (
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={`${getNavLinkClass("#")} cursor-pointer`}
                >
                  <span className="flex items-center gap-1.5">
                    Lainnya
                    <FiChevronDown className={`transition-transform ${isMoreMenuOpen ? "rotate-180" : ""}`} size={14} />
                  </span>
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    {moreMenus.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        target={item.targetBlank ? "_blank" : undefined}
                        rel={item.targetBlank ? "noopener noreferrer" : undefined}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${getNavLinkClass(item.href)}`}
                        onClick={() => setIsMoreMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          {renderIcon(item.icon)}
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className={`hidden xl:flex items-center space-x-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
            {!authLoading && (
              <>
                {isAuthenticated && profile ? (
                  <UserDropdown />
                ) : (
                  <Link href="/login" className="text-white px-6 py-2 rounded-md text-sm font-medium smooth-transition btn-animate" style={{ backgroundColor: "var(--primary)" }}>
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`xl:hidden p-2 rounded-md text-gray-700 smooth-transition hover-lift ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}
            style={{ color: "var(--primary)" }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} className="smooth-transition" /> : <FiMenu size={24} className="smooth-transition" />}
          </button>
        </div>

        {/* Mobile Menu Sidebar */}
        <div className="mobile-menu-sidebar-container">
          <div className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)} />

          <div className={`mobile-menu-sidebar ${isMenuOpen ? "open" : ""}`}>
            {/* Sidebar Header */}
            <div className="mobile-sidebar-header">
              <button onClick={() => setIsMenuOpen(false)} className="mobile-sidebar-close">
                <FiX size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={logoUrl || "/logo.png"}
                  alt={villageName}
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{villageName}</h2>
                  <p className="text-sm text-gray-500">{villageTagline}</p>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="mobile-sidebar-nav">
              {activeMenus.map((item, index) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.targetBlank ? "_blank" : undefined}
                  rel={item.targetBlank ? "noopener noreferrer" : undefined}
                  className={`${getNavLinkClass(item.href, true)} mobile-menu-stagger-${index + 1}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    {renderIcon(item.icon, "flex-shrink-0")}
                    {item.name}
                  </span>
                </Link>
              ))}

              {/* Auth Section - Mobile */}
              {!authLoading && (
                <div className="mobile-menu-auth-section">
                  {isAuthenticated && profile ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="px-3 py-3 bg-gray-50 rounded-md smooth-transition hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--primary)" }}>
                            <FiUser className="text-white" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                            <p className="text-xs text-gray-500">{profile.email}</p>
                          </div>
                        </div>
                      </div>

                      <Link href="/dashboard" className="block w-full text-white px-4 py-3 rounded-md text-sm font-medium smooth-transition btn-animate text-center" style={{ backgroundColor: "var(--primary)" }} onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center justify-center">
                          <FiBarChart className="mr-2" size={16} />
                          Dashboard
                        </div>
                      </Link>

                      <Link href="/dashboard/profile" className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-200 smooth-transition btn-animate text-center" onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center justify-center">
                          <FiUser className="mr-2" size={16} />
                          Profil Saya
                        </div>
                      </Link>

                      <button onClick={handleLogout} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 text-sm font-medium smooth-transition rounded-md">
                        <div className="flex items-center justify-center">
                          <FiLogOut className="mr-2" size={16} />
                          Logout
                        </div>
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="block w-full text-white px-4 py-3 rounded-md text-sm font-medium smooth-transition btn-animate text-center" style={{ backgroundColor: "var(--primary)" }} onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
