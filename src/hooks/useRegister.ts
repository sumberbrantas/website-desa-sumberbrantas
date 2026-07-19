import { useState, useEffect } from "react";
import { useAuthActions } from "@/hooks/useAuth";

interface FormData {
  email: string;
  name: string;
  password: string;
  agreeToTerms: boolean;
}

export const useRegister = () => {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    agreeToTerms: false,
  });

  const { register, loading, error, clearError } = useAuthActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      clearError();
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      return;
    }
    await register(formData.email, formData.password, formData.name);
  };

  return {
    mounted,
    formData,
    showPassword,
    loading,
    error,
    handleInputChange,
    handleTogglePassword,
    handleSubmit,
  };
};
