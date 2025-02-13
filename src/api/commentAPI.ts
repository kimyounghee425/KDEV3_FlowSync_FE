import axiosInstance from "@/src/api/axiosInstance";
import { showToast } from "@/src/utils/showToast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function deleteQuestionComment(

  projectId: number,
  questionId: number,
  commentId: number,
) {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/projects/${projectId}/questions/${questionId}/comments/${commentId}`,
    );
    // console.log(projectId, questionId, commentId)
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteApprovalComment(
  projectId: number,
  approvalId: number,
  commentId: number,
) {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/projects/${projectId}/approvals/${approvalId}/comments/${commentId}`,
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editQuestionComment(
  projectId: number,
  questionId: number,
  commentId: number,
  requestData: any
) {
  console.log(projectId)
  console.log(questionId)
  console.log(commentId)
  console.log(requestData)
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/projects/${projectId}/questions/${questionId}/comments/${commentId}`,
      requestData,
    );
    console.log(requestData)
    return response.data
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editApprovalComment(
  projectId: number,
  approvalId: number,
  commentId: number,
  requestData: any,
) {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/projects/${projectId}/approvals/${approvalId}/comments/${commentId}`,
      requestData,
    );
    return response.data
  } catch (error) {
    console.error(error);
    throw error;
  }
}

