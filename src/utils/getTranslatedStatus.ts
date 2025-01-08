// projectStatus를 한글로 변환하는 함수
export const getTranslatedStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    contract: "계약",
    inProgress: "진행중",
    completed: "납품완료",
    maintenance: "하자보수",
    paused: "일시중단",
    deleted: "삭제",
  };

  return statusMap[status] || "알 수 없음";
};