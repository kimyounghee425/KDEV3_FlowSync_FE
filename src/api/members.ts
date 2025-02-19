import axiosInstance from "@/src/api/axiosInstance";
import {
  ActivateMemberResponse,
  CommonResponseType,
  CreateMemberInput,
  CreateMemberResponse,
  DeactivateMemberResponse,
  DeleteMemberResponse,
  MemberListResponse,
  MemberProps,
} from "@/src/types";

/**
 * 회원 전체 목록을 가져옵니다.
 * @param keyword 검색어 (기본값: "")
 * @param filter 필터링 값 (기본값: "")
 * @param currentPage 현재 페이지 번호
 * @param pageSize 페이지 크기
 * @returns 회원 목록 및 페이징 정보를 담은 객체
 */
export async function fetchMemberListApi(
  keyword: string = "", // 검색키워드
  role: string = "", // 계정타입
  status: string = "", // 활성화여부
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<MemberListResponse>> {
  const response = await axiosInstance.get("/admins/members", {
    params: { keyword, role, status, currentPage, pageSize },
  });

  return response.data;
}

/**
 * 업체 별 소속 회원 전체 목록을 가져옵니다.
 * @param keyword 검색어 (기본값: "")
 * @param filter 필터링 값 (기본값: "")
 * @param currentPage 현재 페이지 번호
 * @param pageSize 페이지 크기
 * @returns 회원 목록 및 페이징 정보를 담은 객체
 */
export async function fetchOrganizationMemberListApi(
  organizationId: string,
  keyword: string = "", // 검색키워드
  role: string = "", // 계정타입
  status: string = "", // 활성화여부
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<MemberListResponse>> {
  const response = await axiosInstance.get(
    `/admins/members/member/org/${organizationId}`,
    {
      params: { organizationId, keyword, role, status, currentPage, pageSize },
    },
  );

  return response.data;
}

/**
 * 소속 업체 별 회원 목록 조회
 * @param requestData 프로젝트 생성 페이지 입력 데이터
 * @returns
 */
export async function fetchMembersWithinOrgApi(organizationId: string) {
  const response = await axiosInstance.get(
    `/admins/members/member/org/${organizationId}`,
  );
  return response.data;
}

// 📌 회원 상세 정보 가져오기
export async function fetchMemberDetails(
  memberId: string,
): Promise<MemberProps> {
  const response = await axiosInstance.get(`/admins/members/${memberId}`);
  return response.data.data; // ✅ `data` 필드만 반환하도록 수정
}

// 📌 회원 생성 API (파일 업로드 X)
export async function createMemberApi(
  memberData: CreateMemberInput,
): Promise<CommonResponseType<CreateMemberResponse>> {
  const response = await axiosInstance.post("/admins/members", memberData);
  return response.data; // 성공 응답 반환
}

// 📌 회원 생성 API (파일 업로드 O)
export async function createMemberWithFile(
  data: CreateMemberInput,
  file: any,
): Promise<CommonResponseType<CreateMemberResponse>> {
  const formData = new FormData();
  // content 객체를 JSON 문자열로 변환하여 추가
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  formData.append("content", JSON.stringify(data));
  formData.append("data", blob);

  // file이 존재할 경우에만 추가
  formData.append("file", file);

  // FormData 전송
  const response = await axiosInstance.post("/admins/members", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // 생성된 데이터 반환
}

// 📌  회원 정보 수정 (PATCH 요청)
export async function updateMemberApi(
  memberId: string,
  updateData: Partial<MemberProps>,
) {
  const response = await axiosInstance.patch(
    `/admins/members/${memberId}`,
    updateData,
  );

  return response.data;
}

// 📌 회원 삭제 (탈퇴 사유 포함)
export async function deleteMemberApi(
  memberId: string,
  reason: string,
): Promise<CommonResponseType<DeleteMemberResponse>> {
  const response = await axiosInstance.post(
    `/admins/members/delete/${memberId}`,
    { reason }, // 🔹 요청 바디에 탈퇴 사유 추가
  );
  return response.data; // ✅ 응답 데이터 반환
}

export async function activateMemberApi(
  memberId: string,
): Promise<CommonResponseType<ActivateMemberResponse>> {
  const response = await axiosInstance.post(
    `/admins/members/activate?memberId=${memberId}`,
  );
  return response.data;
}

export async function deactivateMemberApi(
  memberId: string,
): Promise<CommonResponseType<DeactivateMemberResponse>> {
  const response = await axiosInstance.post(
    `/admins/members/deactivate?memberId=${memberId}`,
  );
  return response.data;
}
