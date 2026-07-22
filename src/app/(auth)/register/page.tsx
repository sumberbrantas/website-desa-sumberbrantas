"use client";

import AuthLayout from "@/component/auth/AuthLayout";
import ProtectedRoute from "@/component/ProtectedRoute";
import RegisterHeader from "@/component/auth/RegisterHeader";
import ErrorMessage from "@/component/auth/ErrorMessage";
import RegisterForm from "@/component/auth/RegisterForm";
import RegisterFooter from "@/component/auth/RegisterFooter";
import { useRegister } from "@/hooks/useRegister";

const RegisterPage = () => {
  const { mounted, formData, showPassword, loading, error, handleInputChange, handleTogglePassword, handleSubmit } = useRegister();

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthLayout imageSrc="/sumberbrantas.jpg" title="Mulai kelola dan kembangkan website Desa Sumberbrantas dengan mudah melalui panel admin" subtitle="Panel Admin" mounted={mounted}>
        <RegisterHeader mounted={mounted} />

        {error && <ErrorMessage error={error} />}

        <RegisterForm mounted={mounted} formData={formData} showPassword={showPassword} loading={loading} onInputChange={handleInputChange} onTogglePassword={handleTogglePassword} onSubmit={handleSubmit} />

        <RegisterFooter mounted={mounted} />
      </AuthLayout>
    </ProtectedRoute>
  );
};

export default RegisterPage;
