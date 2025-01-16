// 서버에서 반환되는 페이징 메타데이터 타입
export interface PaginationInfoType {
  currentPage: number; // 현재 페이지 번호
  totalPages: number;  // 전체 페이지 수
  pageSize: number;    // 한 페이지당 데이터 개수
  totalElements: number; // 전체 데이터 수
  isFirstPage: boolean;  // 첫 번째 페이지 여부
  isLastPage: boolean;   // 마지막 페이지 여부
}