import React from "react";
import Link from "next/link";

interface ForgotPasswordFooterProps {
  mounted: boolean;
}

const ForgotPasswordFooter = ({ mounted }: ForgotPasswordFooterProps) => {
  return (
    <div className={`mt-6 text-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <p className="text-sm text-gray-600 smooth-transition">
        Ingat kata sandi Anda?{" "}
        <Link href="/login" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
          Kembali ke Masuk
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordFooter;
