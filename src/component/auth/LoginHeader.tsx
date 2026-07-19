import { FC } from "react";

interface LoginHeaderProps {
  mounted: boolean;
}

const LoginHeader: FC<LoginHeaderProps> = ({ mounted }) => {
  return (
    <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Masuk</h2>
      <p className="text-gray-500 text-sm smooth-transition">Masuk ke akun Anda untuk mengakses panel admin</p>
    </div>
  );
};

export default LoginHeader;
