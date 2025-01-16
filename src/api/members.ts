import axiosInstance from "./axiosInstance";
import { MemberProps } from "@/src/types/member";
import { MemberResponseType } from "../types/api";

export const fetchMembers = async (
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number
): Promise<MemberResponseType<{ members: MemberProps[] }>> => {
  const response = await axiosInstance.get("/admins/members");
  return response.data;
};
