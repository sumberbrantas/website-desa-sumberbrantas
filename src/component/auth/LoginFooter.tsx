import { FC } from "react";
import Link from "next/link";

interface LoginFooterProps {
  mounted: boolean;
}

const LoginFooter: FC<LoginFooterProps> = ({ mounted }) => {
  return (
    <div className={`mt-6 text-center flex flex-col items-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <p className="text-sm text-gray-600 smooth-transition">
        Belum punya akun?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
          Daftar
        </Link>
      </p>

      <div className="flex items-center gap-3 mt-10">
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
      <div className="text-center items-center mt-3">
        <p className="text-black font-medium text-[10px] md:text-[10px] mb-[2px] smooth-transition">Dikembangkan oleh Tim KKN FIA UB 2026</p>
      </div>
    </div>
  );
};

export default LoginFooter;
