import { PaginationMeta } from './pagination';

// 공통 API 응답 타입 (리스트 응답)
export interface BoardResponse<T> {
  data: T[];              // 응답 데이터
  meta: PaginationMeta;   // 페이징 메타데이터
}