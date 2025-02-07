import { format, parseISO, addHours } from "date-fns";

// iso 형식의 날짜를 예쁘게 포맷 후 반환

export const formatDateWithTime = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // "2025.01.08 11:34" 형태로 변환
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

export function formatDateToISODate(dateString: string | null | undefined): string {
  if (!dateString) return ""; // dateString이 null 또는 undefined이면 빈 문자열 반환
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // "yyyy-mm-dd"
}


export function formatDynamicDate(dateString: string | null | undefined): string {
  if (!dateString) return ""; // dateString이 null 또는 undefined이면 빈 문자열 반환

  const now = new Date();
  const givenDate = new Date(dateString);

  // 당일 여부 확인
  const isToday =
    now.getFullYear() === givenDate.getFullYear() &&
    now.getMonth() === givenDate.getMonth() &&
    now.getDate() === givenDate.getDate();

  // 당일이면 시간(hh:mm), 그렇지 않으면 yyyy-mm-dd 형식 반환
  return isToday ? formatDateWithTime(dateString).split(" ")[1] : formatDateToISODate(dateString);
}

// 게시글, 댓글에 사용할거
export function formattedDate(dateString: string) {
  const date = parseISO(dateString);
  const adjustedDate = addHours(date, 9);
  return format(adjustedDate, "yyyy-MM-dd HH:mm");
};