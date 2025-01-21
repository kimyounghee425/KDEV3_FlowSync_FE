import { LoginFormData } from "@/src/types/loginForm";

export default function LoginInputForm({
  label,
  id,
  type,
  placeholder,
  onChange,
  className = "",
}: LoginFormData & {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={`inputField ${className}`}
      style={{ width: "100%", marginBottom: "16px" }}
    >
      <label
        htmlFor={id}
        className="label"
        style={{
          display: "block",
          marginBottom: "8px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#4A5568",
          textAlign: "left",
        }}
      >
        {label}
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="input"
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #CBD5E0",
          borderRadius: "4px",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#00a8ff")}
        onBlur={(e) => (e.target.style.borderColor = "#CBD5E0")}
      />
    </div>
  );
}
