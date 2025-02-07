import axiosInstance from "@/src/api/axiosInstance";
import {
  CommonResponseType,
  CreateMemberInput,
  CreateMemberResponse,
  DeleteMemberResponse,
  MemberListResponse,
  MemberProps,
} from "@/src/types";

// 📌 회원 목록 Fetch API
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

// 📌 회원 상세 정보 가져오기
export async function fetchMemberDetails(
  memberId: string,
): Promise<MemberProps> {
  const response = await axiosInstance.get(`/admins/members/${memberId}`);
  return response.data.data; // ✅ `data` 필드만 반환하도록 수정
}

// 📌 회원 생성 API (파일 업로드 X)
export async function createMember(
  role: string,
  organizationId: string,
  name: string,
  email: string,
  password: string,
  phoneNum: string,
  jobRole: string,
  jobTitle: string,
  introduction: string,
  remark: string,
): Promise<CreateMemberInput> {
  try {
    const response = await axiosInstance.post("/admins/members", {
      role,
      organizationId,
      name,
      email,
      password,
      phoneNum,
      jobRole,
      jobTitle,
      introduction,
      remark,
    });
    if (response.data.code === 200 && response.data.result === "SUCCESS") {
      return response.data; // 성공 응답 반환
    } else {
      // 실패 메시지 처리
      throw new Error(response.data.message || "로그인에 실패하였습니다.");
    }
  } catch (error: any) {
    console.error("API 호출 에러:", error.message || error);
    alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 다시 확인하세요.");
    throw error;
  }
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
export async function updateMember(
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
export async function deleteMember(
  memberId: string,
  reason: string,
): Promise<DeleteMemberResponse> {
  try {
    const response = await axiosInstance.post(
      `/admins/members/delete/${memberId}`,
      { reason }, // 🔹 요청 바디에 탈퇴 사유 추가
    );
    return response.data; // ✅ 응답 데이터 반환
  } catch (error) {
    throw error; // 🚨 에러 발생 시 throw
  }
}
