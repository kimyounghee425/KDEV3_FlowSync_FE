import { CommonResponseType, NoticeListResponse, NoticeRequestData } from "@/src/types";
import axiosInstance from "@/src/api/axiosInstance";

// 공지사항 생성
export async function fetchNoticeListApi(
  keyword: string = "", // 검색키워드
  category: string = "", // 활성화여부
  isDeleted: string = "",
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<NoticeListResponse>> {
  const response = await axiosInstance.get("/notices", {
    params: { keyword, category, isDeleted, currentPage, pageSize },
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


// 공지사항 수정
export async function editNoticeApi(noticeId: string, requestData: NoticeRequestData ) {
  const response = await axiosInstance.put(
    `/admins/notices/${noticeId}`,
    requestData,
  );
  return response.data;
}

// 공지사항 삭제
export async function deleteNoticeApi(
  noticeId: string,
) {
    const response = await axiosInstance.delete(
      `admins/notices/${noticeId}`,
    );
    return response.data;
}