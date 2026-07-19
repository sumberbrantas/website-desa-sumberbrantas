"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail, signOutUser, resetPassword, updateUserProfile, AuthError, UserProfile } from "@/lib/auth";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmail(email, password);

      if ("error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }
      const userRole = result.profile.role;
      
      setTimeout(() => {
        if (userRole === "pending") {
          router.push("/pending-approval");
        } else if (userRole === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/unauthorized");
        }
      }, 100);

      return { success: true };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat masuk";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signUpWithEmail(email, password, name);

      if ("error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      setTimeout(() => {
        router.push("/register-success");
      }, 100);

      return { success: true };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat mendaftar";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signOutUser();

      if (result && "error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      setTimeout(() => {
        router.push("/login");
      }, 100);

      return { success: true };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat keluar";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await resetPassword(email);

      if (result && "error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      return { success: true, message: "Email reset password telah dikirim. Silakan periksa kotak masuk email Anda (termasuk folder spam)." };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat mengirim email reset password";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (uid: string, updateData: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateUserProfile(uid, updateData);

      if ("error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      return { success: true, profile: result.profile };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat memperbarui profil";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
    loading,
    error,
    clearError,
  };
};

