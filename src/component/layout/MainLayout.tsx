"use client";

import React from "react";
import Header from "@/component/landing-page/Header";
import Breadcrumb from "@/component/common/Breadcrumb";
import PageIndicator from "@/component/common/PageIndicator";
import StatusBar from "@/component/common/StatusBar";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  showPageIndicator?: boolean;
  showStatusBar?: boolean;
}

const MainLayout = ({ 
  children, 
  showBreadcrumb = true, 
  showPageIndicator = true,
  showStatusBar = true
}: MainLayoutProps) => {
  const pathname = usePathname();
  
  const isAuthPage = pathname.startsWith("/login") || 
                     pathname.startsWith("/register") || 
                     pathname.startsWith("/forgot-password");
  
  const isDashboardPage = pathname.startsWith("/dashboard");
  
  const shouldShowPageIndicator = showPageIndicator && !isAuthPage && !isDashboardPage;
  const shouldShowStatusBar = showStatusBar && !isAuthPage && !isDashboardPage;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {showBreadcrumb && <Breadcrumb />}
      <main className="relative">
        {children}
        {shouldShowPageIndicator && (
          <PageIndicator className="hidden lg:flex" />
        )}
        {shouldShowStatusBar && <StatusBar />}
      </main>
    </div>
  );
};

export default MainLayout;

