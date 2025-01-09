import { LoginFormData } from "@/src/types/loginForm";

export default function LoginInputForm({ label, id, type, placeholder, onChange, className = "" }: LoginFormData & { className?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className={`inputField ${className}`}>
      <label htmlFor={id} className="label">
        {label}
        <span className="required"></span>
      </label>
      <input id={id} type={type} placeholder={placeholder} className="input" onChange={onChange} />
    </div>
  );
}
