import axiosInstance from "@/src/api/axiosInstance";
import { SignApiResponse } from "@/src/types";

export async function bringSignApi() {
  const response =
    await axiosInstance.get<SignApiResponse>(`/members/signatures`);

  return response.data;
}

export async function sendSignApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(`/members/signatures`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
