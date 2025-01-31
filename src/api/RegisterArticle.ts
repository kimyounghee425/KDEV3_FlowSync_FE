import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function uploadFileApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(`${BASE_URL}/file`, formData, {
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function createQuestionApi(projectId: number, requestData: any) {
  const response = await axiosInstance.post(
    `${BASE_URL}/projects/${projectId}/questions`,
    requestData,
  );
  return response.data;
}

export async function createTaskApi(projectId: number, requestData: any) {
  const response = await axiosInstance.post(
    `${BASE_URL}/projects/${projectId}/approvals`,
    requestData,
  );
  return response.data;
}
