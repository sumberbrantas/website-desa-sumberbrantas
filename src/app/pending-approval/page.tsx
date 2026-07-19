"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FiClock, FiUser, FiMail, FiLogOut } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Image from "next/image";
import Link from "next/link";
import { confirmLogout, showError } from "@/utils/confirmationUtils";
import CreditsFooter from "@/component/common/CreditsFooter";

const PendingApprovalPage = () => {
  const [mounted, setMounted] = useState(false);
  const { profile, user, loading } = useAuth();
  const { logout } = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    const handleOverflow = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "hidden";
        document.body.style.height = "100vh";
      } else {
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
      }
    };

    handleOverflow();

    window.addEventListener("resize", handleOverflow);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleOverflow);
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, []);

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push("/login");
    } else if (!loading && profile && profile.role !== "pending") {
      router.push("/dashboard");
    }
  }, [loading, user, profile, router]);

  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (confirmed) {
      try {
        await logout();
        router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
        showError("Terjadi kesalahan saat logout");
      }
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col lg:block">
      <Header />
      <div className="h-screen lg:h-screen lg:w-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 lg:fixed lg:inset-0 lg:overflow-hidden">
        <div className={`max-w-6xl w-full smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="relative">
                <Image height={400} width={600} src="/pending-approval.png" alt="Page not found" className="max-w-full h-auto" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">Menunggu Persetujuan</h1>

                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">Akun Anda sedang dalam tahap review oleh administrator. Silahkan hubungi administrator untuk melakukan konfirmasi pendaftaran.</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/"
                    className="bg-[#1B3A6D] text-white px-8 py-2 rounded-lg font-medium border-2 border-[#1B3A6D] hover:bg-[#1B3A6D] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Kembali
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`w-full bg-gray-200 py-4 md:py-4 smooth-transition lg:fixed lg:bottom-0 lg:left-0 lg:z-20 ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </main>
  );
};

export default PendingApprovalPage;

