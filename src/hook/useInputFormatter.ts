/*
 * useInputFormatter.ts: 입력 데이터 포맷팅
 */
"use client";

import { useState } from "react";

export function useInputFormatter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function formatPhoneNumber(value: string): string {
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 7)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
  }

  function formatBusinessNumber(value: string): string {
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 5)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 5)}-${onlyNumbers.slice(5, 10)}`;
  }

  function trimWhitespace(value: string): string {
    return value.replace(/\s{2,}/g, " ").trim();
  }

  function handleFileUpload(file: File | null) {
    if (file) setSelectedFile(file);
  }

  return {
    formatPhoneNumber,
    formatBusinessNumber,
    trimWhitespace,
    handleFileUpload,
    selectedFile,
  };
}
