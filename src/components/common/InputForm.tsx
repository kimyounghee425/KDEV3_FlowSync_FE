"use client";

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
  disabled = false, // 기본값 false 추가
}: InputFormData) {
  const [originalValue, setOriginalValue] = useState(value); // 초기값 저장
  const [isChanged, setIsChanged] = useState(false); // 변경 여부 상태 관리

  useEffect(() => {
    // 수정 시 기존 데이터에서 변경된 사항이 있는 경우
    setIsChanged(value !== originalValue);
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
        {!disabled && <span className={styles.required}>*</span>}{" "}
      </label>
      <input
        id={id}
        className={`${styles.input} ${error ? styles.error : ""} ${
          disabled ? styles.disabled : "" // 수정 시 입력 불가 처리
        } ${isChanged ? styles.changed : ""}`} // 수정된 필드 추가 스타일 적용
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {/* 에러 메시지가 없는 경우, 화면에는 보이지 않지만 고정된 높이를 유지 */}
      <span className={styles.errorText}>{error || " "}</span>{" "}
    </div>
  );
}
