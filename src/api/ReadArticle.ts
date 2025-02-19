import axiosInstance from "@/src/api/axiosInstance";
import {
  QuestionApiResponse,
  ApprovalApiResponse,
  QuestionArticle,
  ApprovalArticle,
  NoticeArticle,
  NoticeApiResponse,
  CommonResponseType,
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

    return response.data.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw new Error("질문 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}

export async function readNoticeApi(
  noticeId: string,
): Promise<CommonResponseType<NoticeArticle>> {
  try {
    const response = await axiosInstance.get<NoticeApiResponse>(
      `/notices/${noticeId}`,
    );

    return response.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw new Error("질문 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}

export async function readApprovalApi(
  projectId: number,
  approvalId: number,
): Promise<ApprovalArticle> {
  try {
    const response = await axiosInstance.get<ApprovalApiResponse>(
      `${BASE_URL}/projects/${projectId}/approvals/${approvalId}`,
    );

    return response.data.data;
  } catch (error) {
    throw new Error("결재 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}

// 결재 서명 막기 위해 내 정보 불러오기
export async function getMyOrgId() {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/me`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function resolveQuestion(projectId: number, questionId: number) {
  try {
    const response = await axiosInstance.post(`/projects/${projectId}/questions/${questionId}/resolve`)
    return response.data;
  } catch (error) {
    console.error(error)
  }
}

export async function getProjectInfo(projectId: number) {
  try {
    const response = await axiosInstance.get(`/projects/${projectId}/project-info`)
    return response.data;
  } catch (error) {
    console.error(error)
  }
}