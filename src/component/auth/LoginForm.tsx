import { FC } from "react";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import LoginOptions from "./LoginOptions";

interface LoginFormProps {
  mounted: boolean;
  formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
  showPassword: boolean;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: FC<LoginFormProps> = ({ mounted, formData, showPassword, loading, onInputChange, onTogglePassword, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
      <AuthInput label="Alamat Email" type="email" id="email" name="email" value={formData.email} onChange={onInputChange} placeholder="Masukkan email..." required mounted={mounted} />

      <AuthInput
        label="Kata Sandi"
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="Masukkan kata sandi..."
        required
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        mounted={mounted}
      />

      <AuthButton type="submit" variant="primary" mounted={mounted} disabled={loading}>
        {loading ? "Masuk..." : "Masuk"}
      </AuthButton>
    </form>
  );
};

export default LoginForm;
