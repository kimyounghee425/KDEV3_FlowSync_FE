import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 회사 정보 가져오기
export async function getOrganizationsApi(type?: string, status?: string) {
  try {
    const params = { type, status, pageSize: 100 };

    const response = await axiosInstance.get(
      `${BASE_URL}/admins/organizations`,
      { params },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
