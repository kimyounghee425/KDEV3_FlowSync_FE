import axiosInstance from "@/src/api/axiosInstance";
import { OrganizationListResponse } from "@/src/types";
import { CommonResponseType } from "@/src/types";

export async function fetchOrganizationList(
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<OrganizationListResponse>> {
  const response = await axiosInstance.get("/admins/organizations", {
    params: { query, filter, currentPage, pageSize },
  });

  return response.data;
}