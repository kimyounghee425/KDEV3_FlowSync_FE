import axiosInstance from "@/src/api/axiosInstance";
import { OrganizationListResponse } from "@/src/types";
import { CommonResponseType } from "@/src/types";

export async function fetchOrganizationList(
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<OrganizationListResponse>> {
  const response = await axiosInstance.get("/admins/members", {
    params: { query, filter, currentPage, pageSize },
  });

  return response.data;
}

export async function fetchMemberInfo(memberId: string) {
  const response = await axiosInstance.get(
    `/admin/members/${memberId}/memberInfo`,
  );
  return response.data;
}

export async function fetchMembersStatusCount() {
  const response = await axiosInstance.get("/admin/members/status-summary");
  return response.data;
}

export async function fetchMemberList(
  memberId: string,
  query: string = "", // 검색어
  boardStatus: string = "", // 게시글 유형
  boardCategory: string = "", // 진행단계
  currentPage: number, // 현재 페이지
  pageSize: number, // 페이지 크기
) {
  const response = await axiosInstance.get(`/admin/members/${memberId}`, {
    params: { query, boardStatus, boardCategory, currentPage, pageSize },
  });

  return response.data;
}

