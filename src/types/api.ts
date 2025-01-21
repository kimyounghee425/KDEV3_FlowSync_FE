import { PaginationProps } from "@/src/types";

// 공통 API 응답 타입 (리스트 응답)
export interface BoardResponseProps<T> {
  data: T[]; // 응답 데이터
  meta: PaginationProps; // 페이징 메타데이터
}

export interface MemberResponseType<T> {
  code: number;
  result: string;
  data: T;
}
