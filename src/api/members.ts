import axiosInstance from "@/src/api/axiosInstance";
import { CommonResponseType, MemberListResponse } from "@/src/types";

export async function fetchMemberList(
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<MemberListResponse>> {
  const response = await axiosInstance.get("/admins/members", {
    params: { query, filter, currentPage, pageSize },
  });

  return response.data;
}