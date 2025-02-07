import { CommonResponseType, NoticeListResponse, NoticeRequestData } from "@/src/types";
import axiosInstance from "@/src/api/axiosInstance";

export async function fetchNoticeListApi(
  keyword: string = "", // 검색키워드
  category: string = "", // 활성화여부
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<NoticeListResponse>> {
  const response = await axiosInstance.get("/notices", {
    params: { keyword, category, currentPage, pageSize },
  });
  return response.data;
}
export async function createNoticeApi( requestData: NoticeRequestData ) {
  const response = await axiosInstance.post(
    `/admins/notices`,
    requestData,
  );
  return response.data;
}