import { PaginationInfoType } from "./pagination";

// 공통 API 응답 타입 (리스트 응답)
export interface BoardResponseType<T> {
  data: T[]; // 응답 데이터
  meta: PaginationInfoType; // 페이징 메타데이터
}

export interface MemberResponseType<T> {
  code: number;
  result: string;
  data: T;
}
