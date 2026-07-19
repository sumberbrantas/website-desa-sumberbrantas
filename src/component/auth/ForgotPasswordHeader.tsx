import React from "react";

interface ForgotPasswordHeaderProps {
  mounted: boolean;
}

const ForgotPasswordHeader = ({ mounted }: ForgotPasswordHeaderProps) => {
  return (
    <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Lupa Kata Sandi</h2>
      <p className="text-gray-500 text-sm smooth-transition">
        Masukkan email Anda untuk menerima tautan reset kata sandi
      </p>
    </div>
  );
};

export default ForgotPasswordHeader;
