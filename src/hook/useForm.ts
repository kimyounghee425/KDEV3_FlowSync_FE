/*
 * useForm.ts: 공통 입력 폼 커스텀 훅 (유효성 검사 로직) 및 유효성 검사 로직
 * 입력값과 에러 상태를 관리하는 로직을 커스텀 훅으로 추출하여 코드 중복을 제거합니다.
 */
import { useState } from "react";

export type InputValues = { [inputName: string]: string }; // 모든 입력값의 집합(입력 필드 이름과 그 값)
type ValidationRule = {
  isValid: (value: string) => boolean; // 입력값이 유효한지 확인하는 함수
  errorMessage: string; // 값이 유효하지 않을 경우 표시할 에러 메시지
};
type ValidationRules = { [inputName: string]: ValidationRule }; // 입력 필드의 검증 규칙들

//  useForm 커스텀 훅
export function useForm(
  defaultValues: InputValues,
  validationRules: ValidationRules,
) {
  const [inputValues, setInputValues] = useState<InputValues>(defaultValues); // 입력값 상태
  const [inputErrors, setInputErrors] = useState<{
    [inputName: string]: string | undefined;
  }>({}); // 에러 상태

  // 특정 입력값 유효성 검사
  function checkInput(inputName: string, inputValue: string) {
    const rule = validationRules[inputName]; // 해당 필드의 검증 규칙
    if (!rule) {
      return;
    }
    const isValid = rule.isValid?.(inputValue); // 함수 존재 여부 체크 후 호출
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [inputName]: isValid ? undefined : rule.errorMessage,
    }));
  }

  // 모든 입력값 유효성 검사
  function checkAllInputs() {
    const newErrors: { [inputName: string]: string } = {}; // 새 에러 상태를 저장할 객체
    // 각 입력 필드에 대해 검증 규칙 적용
    Object.entries(validationRules).forEach(([inputName, rule]) => {
      const inputValue = inputValues[inputName];
      if (!rule.isValid(inputValue)) {
        newErrors[inputName] = rule.errorMessage; // 에러 메시지 추가
      }
    });

    setInputErrors(newErrors); // 에러 상태 업데이트
    // 에러가 없으면 true 반환
    return Object.keys(newErrors).length === 0;
  }

  // 특정 입력 필드 변경 핸들러
  function handleInputChange(inputName: string, inputValue: string) {
    setInputValues((prevValues) => ({
      ...prevValues,
      [inputName]: inputValue,
    }));
    checkInput(inputName, inputValue);
  }

  // 📌 외부에서 `inputValues`를 한 번에 설정하는 함수
  function setFormValues(newValues: InputValues) {
    setInputValues(newValues);
  }

  return {
    inputValues,
    inputErrors,
    handleInputChange,
    checkAllInputs,
    setFormValues, // 외부에서 한 번에 데이터 설정 가능
  };
}
