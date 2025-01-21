// iso 형식의 날짜를 예쁘게 포맷 후 반환

export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // "2025.01.08 11:34" 형태로 변환
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};
