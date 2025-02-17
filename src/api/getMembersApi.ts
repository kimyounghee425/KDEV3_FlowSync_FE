import axiosInstance from "@/src/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMembersApi(
  organizationId: string,
  currentPage: number,
  pageSize: number,
) {
  try {
    const params = { organizationId, currentPage, pageSize };

    const response = await axiosInstance.get(
      `${BASE_URL}/admins/members/member/org/${organizationId}`, // params 에 orgamizationid 있는데 왜 api 주소에 또넣음?
      { params },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMeApi () {
  try {
    const response = await axiosInstance.get("/me");
    return response.data;
  } catch (error) {
    console.log("사용자 정보 가져오는 중 오류 발생 : ", error)
  }
}