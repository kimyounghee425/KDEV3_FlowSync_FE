import axiosInstance from "@/src/api/axiosInstance";


export async function registerComment(
  projectId: number,
  requestData: any,
  questionId?: number,
  approvalId?: number,
  parentId?: number,
) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  let apiPATH: string = "";

  if (pathname.includes("/questions")) {
    apiPATH = `/projects/${projectId}/questions/${questionId}/comments`;
  } else if (pathname.includes("/approvals")) {
    apiPATH = `/projects/${projectId}/approvals/${approvalId}/comments`;
  }

  if (parentId) {
    apiPATH += `/${parentId}/recomments`;
  }

  if (!apiPATH) {
    throw new Error("API URL is not defined");
  }

  const response = await axiosInstance.post(apiPATH, requestData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
