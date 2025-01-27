import { CommonResponseType, NoticeProps } from "@/src/types";
import axiosInstance from "@/src/api/axiosInstance";

export async function fetchNoticeList(
): Promise<CommonResponseType<NoticeProps[]>> {
  const response = await axiosInstance.get("/projects");
  return response.data;
}