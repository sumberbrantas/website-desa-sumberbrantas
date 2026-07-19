"use client";

import AuthLayout from "@/component/auth/AuthLayout";
import ProtectedRoute from "@/component/ProtectedRoute";
import LoginHeader from "@/component/auth/LoginHeader";
import ErrorMessage from "@/component/auth/ErrorMessage";
import LoginForm from "@/component/auth/LoginForm";
import LoginFooter from "@/component/auth/LoginFooter";
import { useLogin } from "@/hooks/useLogin";

const LoginPage = () => {
  const {
    mounted,
    formData,
    showPassword,
    loading,
    error,
    handleInputChange,
    handleTogglePassword,
    handleSubmit,
  } = useLogin();

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthLayout
        imageSrc="/kantor_desa.jpg"
        title="Mulai kelola dan kembangkan website Desa Ngebruk dengan mudah melalui panel admin"
        subtitle="Panel Admin"
        mounted={mounted}
      >
        <LoginHeader mounted={mounted} />

        {error && <ErrorMessage error={error} />}

        <LoginForm
          mounted={mounted}
          formData={formData}
          showPassword={showPassword}
          loading={loading}
          onInputChange={handleInputChange}
          onTogglePassword={handleTogglePassword}
          onSubmit={handleSubmit}
        />

        <LoginFooter mounted={mounted} />
      </AuthLayout>
    </ProtectedRoute>
  );
};

export default LoginPage;

