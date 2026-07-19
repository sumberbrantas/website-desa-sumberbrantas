import { FC } from "react";
import Link from "next/link";

interface LoginOptionsProps {
  mounted: boolean;
  rememberMe: boolean;
  onRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginOptions: FC<LoginOptionsProps> = ({ mounted, rememberMe, onRememberMeChange }) => {
  return (
    <div className={`flex items-center justify-between py-2 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <div className="flex items-center">
        <input type="checkbox" id="rememberMe" name="rememberMe" checked={rememberMe} onChange={onRememberMeChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded smooth-transition" />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 smooth-transition">
          Ingat saya
        </label>
      </div>
      <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline smooth-transition hover:text-blue-800">
        Lupa kata sandi?
      </Link>
    </div>
  );
};

export default LoginOptions;
