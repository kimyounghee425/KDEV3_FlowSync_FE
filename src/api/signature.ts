import axiosInstance from "@/src/api/axiosInstance";
import { SignApiResponse } from "@/src/types";

export async function bringSignApi() {
  try {
    const response =
      await axiosInstance.get<SignApiResponse>(`/members/signatures`);

    // console.log(response);
    return response.data;
  } catch (error) {
    console.error("API 호출 실패", error);
    throw new Error("서명 유무 데이터를 가져오는 중 문제가 발생했습니다.");
  }
}

export async function sendSignApi(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(`/members/signatures`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("서명 이미지 업로드 실패", error);
    throw new Error("서명 이미지 업로드 중 오류가 발생했습니다.");
  }
}
