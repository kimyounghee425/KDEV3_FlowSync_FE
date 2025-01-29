import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMembersApi(
  organizationId: number,
  currentPage: number,
  pageSize: number,
) {
  try {
    const params = { organizationId, currentPage, pageSize };

    const response = await axiosInstance.get(
      `${BASE_URL}/admins/members/org/${organizationId}`, // params 에 orgamizationid 있는데 왜 api 주소에 또넣음?
      { params },
    );
    return response.data;
  } catch (error) {
    console.log("멤버 목록 조회 실패 : ", error);
    throw error;
  }
}
