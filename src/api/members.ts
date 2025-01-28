import axiosInstance from "@/src/api/axiosInstance";
import { CommonResponseType, MemberListResponse } from "@/src/types";

export async function fetchMemberList(
  keyword: string= "", // 검색키워드
  role: string="", // 계정타입
  status: string = "", // 활성화여부
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<MemberListResponse>> {
  const response = await axiosInstance.get("/admins/members", {
    params: { keyword, role, status, currentPage, pageSize },
  });

  return response.data;
}