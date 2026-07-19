import { useState, useEffect } from "react";
import { useAuthActions } from "@/hooks/useAuth";

export const useForgotPassword = () => {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { forgotPassword, loading, error, clearError } = useAuthActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        clearError();
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (error || message) {
      clearError();
      setMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setMessage(result.message || "Email reset password telah dikirim!");
      setEmail("");
    }
  };

  return {
    mounted,
    email,
    message,
    loading,
    error,
    handleInputChange,
    handleSubmit,
  };
};
