"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiChevronRight } from "react-icons/fi";

interface BreadcrumbItem {
  name: string;
  href: string;
  isActive: boolean;
}

const Breadcrumb = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/", isActive: pathname === "/" }
    ];

    let currentPath = "";
    
    const pathNames: Record<string, string> = {
      "berita": "Berita",
      "pengumuman": "Pengumuman",
      "struktur": "Struktur",
      "tentang": "Tentang",
      "pelayanan": "Pelayanan",
      "dashboard": "Dashboard",
      "galeri": "Galeri",
      "login": "Login",
      "register": "Register",
      "forgot-password": "Lupa Password"
    };

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isActive = currentPath === pathname;
      const name = pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        name,
        href: currentPath,
        isActive
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (!mounted || pathname === "/") return null;

  return (
    <nav className={`bg-gray-50/80 border-b border-gray-200 py-2 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && (
                <FiChevronRight className="text-gray-400" size={12} />
              )}
              
              <div className="flex items-center">
                {index === 0 && (
                  <FiHome className="text-gray-500 mr-1" size={12} />
                )}
                
                {item.isActive ? (
                  <span className="breadcrumb-active text-sm">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-[#1B3A6D] smooth-transition"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
