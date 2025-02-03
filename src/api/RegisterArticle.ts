import axiosInstance from "@/src/api/axiosInstance";
import { QuestionRequestData, TaskRequestData } from "@/src/types";


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

export async function createQuestionApi(projectId: number, requestData: QuestionRequestData) {
  const response = await axiosInstance.post(
    `/projects/${projectId}/questions`,
    requestData,
  );
  return response.data;
}

export async function createTaskApi(projectId: number, requestData: TaskRequestData) {
  const response = await axiosInstance.post(
    `/projects/${projectId}/approvals`,
    requestData,
  );
  return response.data;
}
