import axiosInstance from "@/src/api/axiosInstance";
import {
  CommonResponseType,
  OrganizationListResponse,
  CreateOrganizationInput,
  CreateOrganizationResponse,
  OrganizationProps,
  DeleteOriginationResponse,
  DeleteOriginationWithReasonResponse,
} from "@/src/types";

// 📌 업체 목록 Fetch API
export async function fetchOrganizationList(
  keyword: string = "", // 검색어
  type: string = "", // 업체타입
  status: string = "", // 활성화여부
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<OrganizationListResponse>> {
  const response = await axiosInstance.get("/admins/organizations", {
    params: { keyword, type, status, currentPage, pageSize },
  });

  return response.data;
}

// 📌 업체 상세 정보 가져오기
export async function fetchOrganizationDetails(
  organizationId: string,
): Promise<OrganizationProps> {
  const response = await axiosInstance.get(
    `/admins/organizations/${organizationId}`,
  );

  return response.data.data; // ✅ `data` 필드만 반환하도록 수정
}

// 📌 업체 생성 API (파일 업로드 API 완성 시 추가 구현 예정)
export async function createOrganization(
  data: CreateOrganizationInput,
  file?: any,
): Promise<CommonResponseType<CreateOrganizationResponse>> {
  const formData = new FormData();
  // content 객체를 JSON 문자열로 변환하여 추가
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  formData.append("content", JSON.stringify(data));
  formData.append("data", blob);

  // file이 존재할 경우에만 추가
  formData.append("file", file);

  // FormData 전송
  const response = await axiosInstance.post("/admins/organizations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // 생성된 데이터 반환
}

// 📌  업체 정보 수정 (PATCH 요청)
// #TODO 파일 업로드 하여 데이터 multiForm 으로 전송
export async function updateOrganization(
  organizationId: string,
  updateData: Partial<OrganizationProps>,
) {
  const response = await axiosInstance.put(
    `/admins/organizations/${organizationId}`,
    updateData,
  );

  return response.data;
}

// 📌 회원 삭제 (탈퇴 사유 포함 X)
export async function deleteOrigination(
  organizationId: string,
): Promise<DeleteOriginationResponse> {
  try {
    const response = await axiosInstance.post(
      `/admins/originazions/${organizationId}/remove`,
    );

    return response.data; // ✅ 응답 데이터 반환
  } catch (error) {
    throw error; // 🚨 에러 발생 시 throw
  }
}

// 📌 회원 삭제 (탈퇴 사유 포함 ver.)
export async function deleteOriginationWithReason(
  organizationId: string,
  reason: string,
): Promise<DeleteOriginationWithReasonResponse> {
  try {
    const response = await axiosInstance.post(
      `/admins/originazions/delete/${organizationId}`,
      { reason }, // 🔹 요청 바디에 탈퇴 사유 추가
    );
    return response.data; // ✅ 응답 데이터 반환
  } catch (error) {
    throw error; // 🚨 에러 발생 시 throw
  }
}
