"use client";

import { useEffect, useState } from "react";
import { InputFormData } from "@/src/types";
import styles from "@/src/components/common/InputForm.module.css";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // 수정 시 기존 데이터에서 변경된 사항이 있는 경우
    setIsChanged(value !== originalValue);
  }, [value, originalValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(e);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (onChange) onChange(e); // 기존 onChange 핸들러 호출
    }
  }

  return (
    <div className={styles.inputFieldContainer}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {!disabled && <span className={styles.required}>*</span>}
      </label>
      {/* ✅ 일반 입력 필드 vs 파일 업로드 필드 분기 */}
      {type === "file" ? (
        <div className={styles.fileUploadContainer}>
          {/* ✅ 파일 첨부 버튼 */}
          <input
            type="file"
            id={id}
            className={styles.fileInputHidden}
            onChange={handleFileChange}
          />
          <label htmlFor={id} className={styles.fileUploadButton}>
            파일 첨부
          </label>
          {selectedFile && (
            <span className={styles.selectedFileName}>
              ✔ {selectedFile.name}
            </span>
          )}
        </div>
      ) : (
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
      )}
      {/* 에러 메시지 표시 (에러 메시지가 없는 경우에도 레이아웃 유지 위해 높이를 고정) */}
      <span className={styles.errorText}>{error || " "}</span>{" "}
    </div>
  );
}
