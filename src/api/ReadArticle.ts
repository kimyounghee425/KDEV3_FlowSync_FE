import axiosInstance from "@/src/api/axiosInstance";
import { ApiResponse, Article } from "@/src/types"; // 타입 정의 파일 경로에 맞게 수정하세요

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function readQuestionApi(
  projectId: number,
  questionId: number,
): Promise<Article> {
  try {
    const response = await axiosInstance.get<ApiResponse>(
      `${BASE_URL}/projects/${projectId}/questions/${questionId}`,
    );

    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw new Error("질문 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}
