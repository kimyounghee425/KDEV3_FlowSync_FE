/*
 * useValidation.ts: 입력값 유효성 검사
 */

import { showToast } from "@/src/utils/showToast";

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
