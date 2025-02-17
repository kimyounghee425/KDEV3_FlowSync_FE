import axiosInstance from "@/src/api/axiosInstance";

/**
 * 댓글 등록 API
 * @param apiPath - API 요청 경로 (사전 구성 필요)
 * @param requestData - 요청 데이터 (댓글 내용)
 */
export async function registerComment(
  apiPath: string,
  requestData: any,
) {
  if (!apiPath) {
    throw new Error("API URL is not defined");
  }

  const response = await axiosInstance.post(apiPath, requestData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
