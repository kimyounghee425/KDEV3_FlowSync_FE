import { CommonResponseType, NoticeListResponse } from "@/src/types";
import axiosInstance from "@/src/api/axiosInstance";

export async function fetchNoticeList(
): Promise<CommonResponseType<NoticeListResponse>> {
  const response = await axiosInstance.get("/notices");
  return response.data;
}