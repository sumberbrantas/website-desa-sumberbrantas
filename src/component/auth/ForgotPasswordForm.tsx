import React from "react";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

interface ForgotPasswordFormProps {
  email: string;
  loading: boolean;
  mounted: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ForgotPasswordForm = ({
  email,
  loading,
  mounted,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
      <AuthInput
        label="Alamat Email"
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Masukkan email..."
        required
        mounted={mounted}
      />

      <AuthButton
        type="submit"
        variant="primary"
        mounted={mounted}
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Kirim Link Reset"}
      </AuthButton>
    </form>
  );
};

export default ForgotPasswordForm;
