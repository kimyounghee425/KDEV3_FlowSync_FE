import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteQuestionComment(
  projectId: number,
  questionId: number,
  commentId: number,
) {
  const response = await axiosInstance.delete(
    `${BASE_URL}/projects/${projectId}/questions/${questionId}/comments/${commentId}`,
  );
  return response.data;
}

export async function deleteApprovalComment(
  projectId: number,
  approvalId: number,
  commentId: number,
) {
  const response = await axiosInstance.delete(
    `${BASE_URL}/projects/${projectId}/approvals/${approvalId}/comments/${commentId}`,
  );

  return response.data;
}

export async function editQuestionComment(
  projectId: number,
  questionId: number,
  commentId: number,
  requestData: any,
) {
  const response = await axiosInstance.put(
    `${BASE_URL}/projects/${projectId}/questions/${questionId}/comments/${commentId}`,
    requestData,
  );
  return response.data;
}

export async function editApprovalComment(
  projectId: number,
  approvalId: number,
  commentId: number,
  requestData: any,
) {
  const response = await axiosInstance.put(
    `${BASE_URL}/projects/${projectId}/approvals/${approvalId}/comments/${commentId}`,
    requestData,
  );
  return response.data;
}
