import axiosInstance from "@/src/api/axiosInstance";
import {
  QuestionApiResponse,
  TaskApiResponse,
  QuestionArticle,
  TaskArticle,
  NoticeArticle,
  NoticeApiResponse,
} from "@/src/types";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function readQuestionApi(
  projectId: number,
  questionId: number,
): Promise<QuestionArticle> {
  try {
    const response = await axiosInstance.get<QuestionApiResponse>(
      `${BASE_URL}/projects/${projectId}/questions/${questionId}`,
    );

    console.log(response.data.data.content);
    return response.data.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw new Error("질문 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}

export async function readNoticeApi(noticeId: string): Promise<NoticeArticle> {
  try {
    const response = await axiosInstance.get<NoticeApiResponse>(
      `/notices/${noticeId}`,
    );

    // console.log(response.data.data.content)
    return response.data.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw new Error("질문 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}

export async function readTaskApi(
  projectId: number,
  approvalId: number,
): Promise<TaskArticle> {
  try {
    const response = await axiosInstance.get<TaskApiResponse>(
      `${BASE_URL}/projects/${projectId}/approvals/${approvalId}`,
    );

    // console.log(response.data)

    return response.data.data;
  } catch (error) {
    console.log("Api 호출 실패", error);
    throw new Error("결재 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}
