import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerComment(
  projectId: number,
  questionId: number,
  requestData: any,
) {
  const response = await axiosInstance.post(
    `${BASE_URL}/projects/${projectId}/questions/${questionId}/comments`,
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}

export async function registerCommentReply(
  projectId: number,
  questionId: number,
  parentId: number,
  requestData: any,
) {
  const response = await axiosInstance.post(
    `${BASE_URL}/projects/${projectId}/questions/${questionId}/comments/${parentId}/recomments`,
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}
