import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  title: string;
  subtitle: string;
  mounted?: boolean;
}

const AuthLayout = ({ children, imageSrc, title, subtitle, mounted = true }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className={`hidden lg:flex lg:w-1/2 relative smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div
          className="absolute inset-0 bg-cover bg-center smooth-transition"
          style={{
            backgroundImage: `url('${imageSrc}')`,
          }}
        />

        <div className="absolute inset-0 bg-earth-dark/80 smooth-transition"></div>

        <div className={`relative z-10 flex flex-col justify-start items-start p-8 text-white w-full smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <div className={`mb-4 mt-4 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <div className="flex items-center mb-6">
              <img
                src="/logo.png"
                alt="Desa Logo"
                className="w-14 h-14 object-contain smooth-transition hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  const svgElement = target.nextElementSibling as HTMLElement;
                  target.style.display = "none";
                  if (svgElement) {
                    svgElement.style.display = "block";
                  }
                }}
              />
              <div className="pl-2 smooth-transition">
                <h2 className="text-lg font-bold text-white smooth-transition">Website Desa</h2>
                <p className="text-sm smooth-transition" style={{ color: "rgba(255,255,255,0.7)" }}>Panel Admin</p>
              </div>
            </div>
          </div>

          <div className={`max-w-sm smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
            <h1 className="text-2xl font-semibold mb-4 leading-tight text-white smooth-transition">{title}</h1>
          </div>
        </div>
      </div>

      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ backgroundColor: "var(--background)" }}>
        <div className={`w-full max-w-sm smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
