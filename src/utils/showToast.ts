import { toaster } from "@/src/components/ui/toaster";

const toastMessages = new Set(); // 중복 방지를 위한 Set

export const showToast = ({
  title = "오류 발생!",
  description = "문제가 발생했습니다.",
  type = "error",
  duration = 3000,
  error = null as string | null | undefined,
}) => {
  if (error) {
    console.error("❌ Error:", error); // 콘솔에도 오류 출력 가능
  }
  // 중복 체크: 동일한 description이 존재하는 경우 새 토스트 생성 안 함
  if (toastMessages.has(description)) return;

  // 토스트 메시지 Set에 추가
  toastMessages.add(description);

  toaster.create({
    title,
    description,
    type,
    duration,
    onStatusChange({ status }) {
      if (status === "unmounted") {
        toastMessages.delete(description); // 토스트 닫힐 때 Set에서 제거
      }
    },
  });
};
