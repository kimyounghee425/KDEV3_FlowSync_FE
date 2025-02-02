import axiosInstance from "@/src/api/axiosInstance";
import { CommonResponseType, ReissueResponse, UserInfoResponse } from "@/src/types";

// 사용자 권한 API 호출
export async function fetchUserInfo(accessToken?: string): Promise<CommonResponseType<UserInfoResponse>> {
  const response = await axiosInstance.get("/me", {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Cookie: `access=${accessToken}` } : {}), // ✅ 서버 환경에서 쿠키 강제 포함
    },
    withCredentials: true, // ✅ 클라이언트 환경에서도 쿠키 포함
    validateStatus: (status) => status < 500, // 🔹 500 이상만 오류로 처리
  });
  
  return response.data;
}

// 🔹 Refresh Token을 포함하여 토큰 재발급 요청
export async function fetchReissueToken(refreshToken?: string): Promise<CommonResponseType<ReissueResponse>> {
  const response = await axiosInstance.get("/reissue", {
    headers: {
      "Content-Type": "application/json",
      ...(refreshToken ? { Cookie: `refresh=${refreshToken}` } : {}), // ✅ 서버 환경에서 Refresh Token 포함
    },
    withCredentials: true, // ✅ 클라이언트 환경에서도 쿠키 포함
    validateStatus: (status) => status < 500, // 🔹 500 이상만 오류로 처리
  });

  return response.data;
}

// 로그인 API 호출 => 액세스 토큰 & user 정보 반환
export async function login(email: string, password: string) {
  const response = await axiosInstance.post("/login", { email, password });
  // console.log("로그인 API 응답 완료 - response: ", response);
  return response;
}

// 로그아웃 API 호출
export async function logout(): Promise<void> {
  await axiosInstance.post("/logout");
  console.log("로그아웃 성공!");
}
