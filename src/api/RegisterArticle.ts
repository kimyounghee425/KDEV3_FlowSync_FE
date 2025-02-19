import axiosInstance from "@/src/api/axiosInstance";
import { QuestionRequestData, ApprovalRequestData } from "@/src/types";

export async function uploadFileApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/file", formData, {
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function uploadContentFileApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/file/public", formData, {
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
  return response.data;
}

// 질문글 생성
export async function createQuestionApi(
  projectId: number,
  requestData: QuestionRequestData,
) {
  const response = await axiosInstance.post(
    `/projects/${projectId}/questions`,
    requestData,
  );
  return response.data;
}

// 질문글 수정
export async function updateQuestionApi(
  projectId: number,
  questionId: number,
  requestData: QuestionRequestData,
) {
  const response = await axiosInstance.put(
    `projects/${projectId}/questions/${questionId}`,
    requestData,
  );
  return response.data;
}

// 질문글 삭제
export async function deleteQuestionApi(projectId: number, questionId: number) {
  const response = await axiosInstance.delete(
    `projects/${projectId}/questions/${questionId}`,
  );
  return response.data;
}

// 결재글 생성
export async function createApprovalApi(
  projectId: number,
  requestData: ApprovalRequestData,
) {
  const response = await axiosInstance.post(
    `/projects/${projectId}/approvals`,
    requestData,
  );
  return response.data;
}

// 결재글 수정
export async function editApprovalApi(
  projectId: number,
  approvalId: number,
  requestData: ApprovalRequestData,
) {
  const response = await axiosInstance.put(
    `projects/${projectId}/approvals/${approvalId}`,
    requestData,
  );
  return response.data;
}

// 결재글 삭제
export async function deleteApprovalApi(projectId: number, approvalId: number) {
  const response = await axiosInstance.delete(
    `projects/${projectId}/approvals/${approvalId}`,
  );
  return response.data;
}
