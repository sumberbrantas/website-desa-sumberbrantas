"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as ReactIcons from "react-icons/fi";

// Dynamic menu component that renders navigation items from CMS
interface DynamicMenuProps {
  variant?: "desktop" | "mobile";
  onItemClick?: () => void;
}

const DynamicMenu = ({ variant = "desktop", onItemClick }: DynamicMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const { getMenus } = await import("@/lib/menuService");
        const activeMenus = await getMenus(true);
        setMenus(activeMenus);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  // Helper to render icon dynamically
  const renderIcon = (iconName: string | undefined, className: string = "") => {
    if (!iconName) return null;

    const IconComponent = (ReactIcons as any)[iconName];
    if (!IconComponent) return null;

    return <IconComponent className={className} />;
  };

  // Check if path is active
  const isActivePath = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  // Base classes
  const baseClasses = "navbar-link text-gray-700 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300";
  const mobileBaseClasses = "navbar-link text-gray-700 px-3 py-3 text-sm font-medium rounded-md transition-all duration-300";

  if (variant === "mobile") {
    return (
      <nav className="mobile-sidebar-nav">
        {menus.map((menu, index) => {
          const isActive = isActivePath(menu.href);
          return (
            <Link
              key={menu.id}
              href={menu.href}
              target={menu.targetBlank ? "_blank" : undefined}
              rel={menu.targetBlank ? "noopener noreferrer" : undefined}
              onClick={onItemClick}
              className={`${mobileBaseClasses} ${
                isActive ? "active-mobile" : ""
              } mobile-menu-stagger-${index + 1}`}
            >
              <span className="flex items-center gap-2">
                {renderIcon(menu.icon, "flex-shrink-0")}
                {menu.name}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden xl:flex space-x-2 smooth-transition">
      {menus.map((menu, index) => {
        const isActive = isActivePath(menu.href);
        return (
          <Link
            key={menu.id}
            href={menu.href}
            target={menu.targetBlank ? "_blank" : undefined}
            rel={menu.targetBlank ? "noopener noreferrer" : undefined}
            className={`${baseClasses} ${isActive ? "active" : ""}`}
            style={{ animationDelay: `${(index + 2) * 0.05}s` }}
          >
            <span className="flex items-center gap-1.5">
              {renderIcon(menu.icon)}
              {menu.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DynamicMenu;
