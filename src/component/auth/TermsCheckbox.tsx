import { FC } from "react";
import Link from "next/link";

interface TermsCheckboxProps {
  mounted: boolean;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TermsCheckbox: FC<TermsCheckboxProps> = ({ mounted, checked, onChange }) => {
  return (
    <div className={`flex items-start space-x-3 py-2 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <input type="checkbox" id="agreeToTerms" name="agreeToTerms" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded smooth-transition" required />
      <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed smooth-transition">
        Dengan membuat akun, saya setujui dengan{" "}
        <Link href="/terms" className="text-blue-600 hover:underline smooth-transition hover:text-blue-800">
          Ketentuan Penggunaan
        </Link>{" "}
        dan{" "}
        <Link href="/privacy" className="text-blue-600 hover:underline smooth-transition hover:text-blue-800">
          Kebijakan Privasi
        </Link>
      </label>
    </div>
  );
};

export default TermsCheckbox;
