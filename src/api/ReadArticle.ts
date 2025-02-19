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
  const response = await axiosInstance.get<QuestionApiResponse>(
    `${BASE_URL}/projects/${projectId}/questions/${questionId}`,
  );

  return response.data.data;
}

export async function readNoticeApi(
  noticeId: string,
): Promise<CommonResponseType<NoticeArticle>> {
  const response = await axiosInstance.get<NoticeApiResponse>(
    `/notices/${noticeId}`,
  );

  return response.data;
}

export async function readApprovalApi(
  projectId: number,
  approvalId: number,
): Promise<ApprovalArticle> {
  const response = await axiosInstance.get<ApprovalApiResponse>(
    `${BASE_URL}/projects/${projectId}/approvals/${approvalId}`,
  );

  return response.data.data;
}

// 결재 서명 막기 위해 내 정보 불러오기
export async function getMyOrgId() {
  const response = await axiosInstance.get(`${BASE_URL}/me`);
  return response.data;
}

export async function resolveQuestion(projectId: number, questionId: number) {
  const response = await axiosInstance.post(
    `/projects/${projectId}/questions/${questionId}/resolve`,
  );
  return response.data;
}

export async function getProjectInfo(projectId: number) {
  const response = await axiosInstance.get(
    `/projects/${projectId}/project-info`,
  );
  return response.data;
}
