import { FC } from "react";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import TermsCheckbox from "./TermsCheckbox";

interface RegisterFormProps {
  mounted: boolean;
  formData: {
    email: string;
    name: string;
    password: string;
    agreeToTerms: boolean;
  };
  showPassword: boolean;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: FC<RegisterFormProps> = ({ mounted, formData, showPassword, loading, onInputChange, onTogglePassword, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
      <AuthInput label="Alamat Email" type="email" id="email" name="email" value={formData.email} onChange={onInputChange} placeholder="Masukkan email..." required mounted={mounted} />

      <AuthInput label="Nama" type="text" id="name" name="name" value={formData.name} onChange={onInputChange} placeholder="Masukkan nama..." required mounted={mounted} />

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

      <TermsCheckbox mounted={mounted} checked={formData.agreeToTerms} onChange={onInputChange} />

      <AuthButton type="submit" variant="primary" disabled={!formData.agreeToTerms || loading} mounted={mounted}>
        {loading ? "Mendaftar..." : "Daftar"}
      </AuthButton>
    </form>
  );
};

export default RegisterForm;
