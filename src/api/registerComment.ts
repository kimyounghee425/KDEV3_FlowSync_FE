import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerComment(
  projectId: number,
  requestData: any,
  questionId?: number,
  taskId?: number,
  parentId?: number,
) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  let apiURL: string = "";

  if (pathname.includes("/questions")) {
    apiURL = `${BASE_URL}/projects/${projectId}/questions/${questionId}/comments`;
  } else if (pathname.includes("/tasks")) {
    apiURL = `${BASE_URL}/projects/${projectId}/approvals/${taskId}/comments`;
  }

  if (parentId) {
    apiURL += `/${parentId}/recomments`;
  }

  if (!apiURL) {
    throw new Error("API URL is not defined");
  }

  const response = await axiosInstance.post(apiURL, requestData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
