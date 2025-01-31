"use client";
import React, { useState, useEffect } from "react";
import styles from "./InputForm.module.css"; // ★ InputForm과 동일한 CSS 모듈
import AddressAPI from "@/src/components/common/AddressAPI";

interface AddressFormProps {
  id: string;              // Input의 id
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;      // disabled 일 때는 수정 불가 & 별 표시 숨김
}

export default function AddressForm({
  id,
  label,
  value = "",
  onChange,
  placeholder,
  error = "",
  disabled = false,
}: AddressFormProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  // InputForm과 동일하게 '초기값'과 '현재값'을 비교하여 '변경됨' 여부를 표시할 수 있음
  const [originalValue, setOriginalValue] = useState(value);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    // 초기값과 현재값이 다르면 '변경됨' 상태로 표시
    setIsChanged(value !== originalValue);
  }, [value, originalValue]);

  const handleAddressComplete = (selectedAddress: string) => {
    onChange(selectedAddress);
    setModalOpen(false);
  };

  return (
    <div className={styles.inputField}>
      {/* 라벨 */}
      <label htmlFor={id} className={styles.label}>
        {label}
        {/* disabled가 아닐 때만 빨간 별 보이기 */}
        {!disabled && <span className={styles.required}>*</span>}
      </label>

      {/* 인풋 */}
      <input
        id={id}
        className={`
          ${styles.input} 
          ${error ? styles.error : ""} 
          ${disabled ? styles.disabled : ""} 
          ${isChanged ? styles.changed : ""}
        `}
        type="text"
        placeholder={placeholder}
        value={value}
        readOnly={!disabled}      // 주소 직접 입력 불가 시 readOnly
        onClick={() => !disabled && setModalOpen(true)} 
        disabled={disabled}       // disabled면 클릭 동작도 막을 수 있음
      />

      {/* 에러 메시지 (또는 공백) */}
      <span className={styles.errorText}>{error || " "}</span>

      {/* 주소 검색 모달 */}
      {isModalOpen && (
        <AddressAPI
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onComplete={handleAddressComplete}
        />
      )}
    </div>
  );
}
