import { InputFormData } from "@/src/types";
import styles from "./InputForm.module.css";
import { useEffect, useState } from "react";

// 공통 컴포넌트 (로그인/회원 생성/업체 생성 등 입력창 & 에러메시지)
export default function InputForm({
  id,
  type,
  label,
  placeholder,
  value = "",
  error = "",
  onChange,
  disabled = false, // ✅ 기본값 false 추가
}: InputFormData) {
  const [originalValue, setOriginalValue] = useState(value); // ✅ 초기값 저장
  const [isChanged, setIsChanged] = useState(false); // ✅ 변경 여부 상태 관리

  useEffect(() => {
    // 🔹 입력값이 변경될 경우 상태 반영
    setIsChanged(value !== originalValue); // 초기값이 비어있지 않으면 변경된 것으로 간주
  }, [value, originalValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <div className={styles.inputField}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {/* ✅ disabled일 경우 * 숨김 */}
        {!disabled && <span className={styles.required}>*</span>}{" "}
      </label>
      <input
        id={id}
        className={`${styles.input} ${error ? styles.error : ""} ${
          disabled ? styles.disabled : ""
        } ${isChanged ? styles.changed : ""}`} // ✅ 변경된 필드 스타일 적용
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled} // ✅ 추가: 입력 비활성화 적용
      />
      {/* 에러 메시지가 없는 경우, 화면에는 보이지 않지만 고정된 높이를 유지 */}
      {/* 에러가 없으면 빈 공백 출력 */}
      <span className={styles.errorText}>{error || " "}</span>{" "}
    </div>
  );
}
