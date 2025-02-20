// 날짜를 'YYYY-MM-DD HH:mm' 형식으로 변환하는 유틸 함수
export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 1월이 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 날짜를 'YYYY-MM-DD' 형식으로 변환하는 유틸 함수
export const formatDateWithoutTime = (date: Date | null): string => {
  if (!date) return "";

  // 로컬 타임존에서 날짜 계산
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0"); // 1월이 0부터 시작하므로 +1
  const day = String(localDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00`;
};
