import axiosInstance from "@/src/api/axiosInstance";
import {
  CommonResponseType,
  OrganizationListResponse,
  CreateOrganizationInput,
  CreateOrganizationResponse,
} from "@/src/types";

export async function fetchOrganizationList(
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<OrganizationListResponse>> {
  const response = await axiosInstance.get("/admins/organizations", {
    params: { query, filter, currentPage, pageSize },
  });

  return response.data;
}

export async function createOrganization(
  data: CreateOrganizationInput,
  file: any, // file 타입을 File 또는 null로 처리
): Promise<CommonResponseType<CreateOrganizationResponse>> {
  // application/json
  // const content = new FormData();
  // Object.entries(data).forEach(([key, value]) => {
  //   if (value !== null && value !== undefined) {
  //     // 파일이 있는 경우 처리
  //     content.append(key, value instanceof File ? value : value.toString());
  //   }
  // });

  // const response = await axiosInstance.post("/admin/organizations", content, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // multipart / formData;
  const formData = new FormData();
  // content 객체를 JSON 문자열로 변환하여 추가
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  formData.append("content", JSON.stringify(data));
  formData.append("data", blob);

  // file이 존재할 경우에만 추가
  formData.append("file", file);

  console.log("업체 생성 API 호출 전 - formData 생성: ", formData);

  // FormData 전송
  const response = await axiosInstance.post("/admins/organizations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("업체 생성 API 호출 응답 - response: ", response);
  console.log("업체 생성 API 호출 응답 - response.data: ", response.data);
  return response.data; // 생성된 데이터 반환
}
