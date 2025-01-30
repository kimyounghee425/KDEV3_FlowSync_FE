import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createProjectApi(requestData: any) {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/admins/projects`,
      requestData,
    );
    return response.data;
  } catch (error) {
    console.error("프로젝트 생성 실패", error);
    throw error;
  }
}
