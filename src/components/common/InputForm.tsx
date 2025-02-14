"use client";

import { useState } from "react";
import AddressAPI from "@/src/components/common/AddressAPI";
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
  isChanged,
  maxLength,
  onKeyDown,
}: InputFormData) {
  const [originalValue, setOriginalValue] = useState(value); // 초기값 저장
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // 비번 입력할 땐 스페이스 입력 방지
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "password" && e.key === " ") {
      e.preventDefault(); // ✅ 스페이스 입력 차단
    }
  };

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

  function getDisplayFileName(fileValue: string | File) {
    if (typeof fileValue === "string" && fileValue.includes("|")) {
      const [fileName] = fileValue.split("|");
      return fileName.replace(/^[0-9_]+/, ""); // 숫자 및 언더스코어 제거
    }
    if (fileValue instanceof File) {
      return fileValue.name;
    }
    return "파일을 선택하세요";
  }

  function getFileUrl(fileValue: string | File) {
    if (typeof fileValue === "string" && fileValue.includes("|")) {
      return fileValue.split("|")[1]; // URL만 반환
    }
    return null;
  }

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      // 기존 event 객체를 복사하면서 target.value 값을 유지하여 새로운 이벤트 객체를 생성
      const fakeEvent = {
        ...event,
        target: { ...event.target, value: event.target.value },
      };
      onChange(fakeEvent);
    }
  }

  function handleAddressSelect(selectedAddress: string) {
    if (onChange) {
      // 주소 선택 시, 가짜 이벤트 객체를 만들어 onChange 호출
      // `React.ChangeEvent<HTMLInputElement>`로 타입 단언 (타입스크립트 에러 방지)
      const fakeEvent = {
        target: { value: selectedAddress },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(fakeEvent);
    }
    setModalOpen(false); // 주소 선택 후 모달 닫기
  }

  return (
    <div className={styles.inputFieldContainer}>
      <label className={styles.label}>
        {label}
        {!disabled && <span className={styles.required}>*</span>}
      </label>
      {/* 주소 입력 필드 - 클릭 시 검색 모달 오픈 */}
      {type === "address" ? (
        <>
          <input
            id={id}
            className={`${styles.input} ${error ? styles.error : ""} ${isChanged ? styles.changed : ""}`}
            type="text"
            placeholder={placeholder}
            value={value}
            readOnly={!disabled} // 주소 직접 입력 방지 (검색 기능을 통해서만 입력)
            onChange={handleAddressChange} // 입력 변경 처리 (입력 가능할 경우)
            onClick={() => !disabled && setModalOpen(true)} // 클릭 시 모달 오픈 (disabled 상태가 아닐 때만)
          />
          {/* 주소 검색 모달 (isModalOpen 상태가 true일 때만 렌더링) */}
          {isModalOpen && (
            <AddressAPI
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onComplete={(selectedAddress) => {
                handleAddressSelect(selectedAddress); // 선택된 주소를 입력 필드에 반영
              }}
            />
          )}
        </>
      ) : // 일반 입력 필드 vs 파일 업로드 필드
      type === "file" ? (
        <div className={styles.fileUploadContainer}>
          <input
            type="file"
            id={id}
            className={styles.fileInputHidden}
            onChange={handleFileChange}
          />
          <label htmlFor={id} className={styles.fileUploadButton}>
            파일 첨부
          </label>
          {selectedFile || value ? (
            <a
              href={getFileUrl(value) || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.selectedFileName}
            >
              ✔ {selectedFile?.name || getDisplayFileName(value)}
            </a>
          ) : null}
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
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
        />
      )}
      {/* 에러 메시지 표시 (에러 메시지가 없는 경우에도 레이아웃 유지 위해 높이를 고정) */}
      <span className={styles.errorText}>{error || " "}</span>
    </div>
  );
}
