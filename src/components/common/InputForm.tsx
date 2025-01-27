import { InputFormData } from "@/src/types";
import styles from "./InputForm.module.css";

// 공통 컴포넌트 (로그인/회원 생성/업체 생성 등 입력창 & 에러메시지)
export default function InputForm({
  id,
  type,
  label,
  placeholder,
  value = "",
  error = "",
  onChange,
}: InputFormData) {
  return (
    <div className={styles.inputField}>
      <label htmlFor={id} className={styles.label}>
        {label}
        <span className={styles.required}>*</span>
      </label>
      <input
        id={id}
        className={`${styles.input} ${error ? styles.error : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {/* 에러 메시지가 없는 경우, 화면에는 보이지 않지만 고정된 높이를 유지 */}
      {/* 에러가 없으면 빈 공백 출력 */}
      <span className={styles.errorText}>{error || " "}</span>{" "}
    </div>
  );
}
