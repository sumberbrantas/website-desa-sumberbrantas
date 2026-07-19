"use client";

import AuthLayout from "@/component/auth/AuthLayout";
import ProtectedRoute from "@/component/ProtectedRoute";
import ForgotPasswordHeader from "@/component/auth/ForgotPasswordHeader";
import SuccessMessage from "@/component/auth/SuccessMessage";
import ErrorMessage from "@/component/auth/ErrorMessage";
import ForgotPasswordForm from "@/component/auth/ForgotPasswordForm";
import ForgotPasswordFooter from "@/component/auth/ForgotPasswordFooter";
import { useForgotPassword } from "@/hooks/useForgotPassword";

const ForgotPasswordPage = () => {
  const { mounted, email, message, loading, error, handleInputChange, handleSubmit } = useForgotPassword();

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthLayout imageSrc="/kantor_desa.jpg" title="Pulihkan akses ke panel admin Desa Ngebruk dengan mudah" subtitle="Reset Password" mounted={mounted}>
        <ForgotPasswordHeader mounted={mounted} />

        {message && <SuccessMessage message={message} />}

        {error && <ErrorMessage error={error} />}

        <ForgotPasswordForm email={email} loading={loading} mounted={mounted} onEmailChange={handleInputChange} onSubmit={handleSubmit} />

        <ForgotPasswordFooter mounted={mounted} />
      </AuthLayout>
    </ProtectedRoute>
  );
};

export default ForgotPasswordPage;
