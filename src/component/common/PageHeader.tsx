import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  mounted?: boolean;
}

const PageHeader = ({ title, subtitle, actions, mounted = true }: PageHeaderProps) => {
  return (
    <header className={`card-earth-static app-header border-b smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start lg:items-center gap-2 lg:gap-4">
        <div className="min-w-0 flex-1 lg:flex-none">
          <h1 className="app-text-2xl font-bold text-earth-dark smooth-transition whitespace-nowrap">{title}</h1>
          {subtitle && <p className="text-earth-muted text-xs mt-1 smooth-transition hidden sm:block">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
