import axiosInstance from "@/src/api/axiosInstance";
import {
  CommonResponseType,
  CreateMemberInput,
  CreateMemberResponse,
  MemberListResponse,
} from "@/src/types";

export async function fetchMemberList(
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

// 회원 생성 API (파일 업로드 X)
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
  console.log("회원 등록 API 호출 응답 - response: ", response);
  console.log("회원 등록 API 호출 응답 - response.data: ", response.data);
  return response.data; // 생성된 데이터 반환
}

// 회원 생성 API (파일 업로드 O)
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

  console.log("회원 등록 API 호출 전 - formData 생성: ", formData);

  // FormData 전송
  const response = await axiosInstance.post("/admins/members", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("회원 등록 API 호출 응답 - response: ", response);
  console.log("회원 등록 API 호출 응답 - response.data: ", response.data);
  return response.data; // 생성된 데이터 반환
}
