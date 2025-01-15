import axiosInstance from "./axiosInstance";
import { BoardResponse } from "@/src/types";
import { MemberProps } from "@/src/types/member";

export const fetchMembers = async (
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number
): Promise<BoardResponse<MemberProps>> => {
  const response = await axiosInstance.get("/admin/members", {
    params: { query, filter, currentPage, pageSize },
  });
  return response.data;
};

export const fetchMemberInfo = async (memberId: string) => {
  const response = await axiosInstance.get(`/admin/members/${memberId}/memberInfo`);
  return response.data;
};

// export const fetchMemberProgressCount = async (memberId: string) => {
//   const response = await axiosInstance.get(`/admin/members/${memberId}/progressCount`);
//   return response.data;
// };

export const fetchMembersStatusCount = async () => {
  const response = await axiosInstance.get("/admin/members/status-summary");
  return response.data;
};

export const fetchMemberList = async (
  memberId: string,
  query: string = "", // 검색어
  boardStatus: string = "", // 게시글 유형
  boardCategory: string = "", // 진행단계
  currentPage: number, // 현재 페이지
  pageSize: number // 페이지 크기
) => {
  const response = await axiosInstance.get(`/admin/members/${memberId}`, {
    params: { query, boardStatus, boardCategory, currentPage, pageSize },
  });
  return response.data;
};
