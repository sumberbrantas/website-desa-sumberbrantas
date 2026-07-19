import { FC } from "react";

interface RegisterHeaderProps {
  mounted: boolean;
}

const RegisterHeader: FC<RegisterHeaderProps> = ({ mounted }) => {
  return (
    <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Daftar</h2>
      <p className="text-gray-500 text-sm smooth-transition">Daftarkan akun untuk mengakses website</p>
    </div>
  );
};

export default RegisterHeader;
