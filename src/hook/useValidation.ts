/*
 * useValidation.ts: 입력값 유효성 검사
 */

import { showToast } from "@/src/utils/showToast";
import { validationRulesOfProject } from "../constants/validationRules";

export function useValidation(checkAllInputs: () => boolean) {
  function validateInputs(inputValues: Record<string, string>) {
    if (!checkAllInputs()) {
      showToast({
        title: "입력값을 확인하세요.",
        description: "필수 정보를 올바르게 입력해주세요.",
        type: "info",
      });
      return false;
    }
    return true;
  }

  return { validateInputs };
}

// 📌 프로젝트 생성, 수정 시 유효성 검사 함수
export function validateForm(formData: any) {
  for (const rule of validationRulesOfProject) {
    if (rule.condition(formData[rule.field])) {
      showToast({
        title: "필수 입력정보",
        description: rule.message,
        duration: 2000,
      });
      return false; // 🚨 첫 번째 오류가 발생하면 바로 중단
    }
  }
  return true; // ✅ 모든 검사를 통과하면 true 반환
}
