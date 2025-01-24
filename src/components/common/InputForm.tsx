import { InputFormData } from "@/src/types/inputForm";

// 공통 컴포넌트 (로그인/회원 생성/업체 생성 등 입력창 & 에러메시지)
export default function InputForm({
  id,
  type,
  label,
  placeholder,
  value = "",
  error = "",
  onChange,
  className = "",
}: InputFormData & {
  className?: string;
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
        className="input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px",
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#00a8ff")}
      />
      {/* 에러 메시지가 없는 경우, 화면에는 보이지 않지만 고정된 높이를 유지 */}
      <span
        style={{
          display: "block",
          color: error ? "red" : "transparent",
          fontSize: "10px",
          height: "12px",
          marginTop: "4px",
        }}
      >
        {error || " "} {/* 에러가 없으면 빈 공백 출력 */}
      </span>
    </div>
  );
}
