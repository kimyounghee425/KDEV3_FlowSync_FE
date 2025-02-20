import axiosInstance from "@/src/api/axiosInstance";
import {
  CommonResponseType,
  ReissueResponse,
  UserInfoResponse,
} from "@/src/types";
import { axiosForMiddleware } from "@/src/api/axiosForMiddleware";

// 사용자 권한 API 호출
export async function fetchUserInfoApi(
  accessToken?: string,
): Promise<CommonResponseType<UserInfoResponse>> {
  const response = await axiosForMiddleware.get("/me", {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Cookie: `access=${accessToken}` } : {}), // 서버 환경에서 쿠키 강제 포함
    },
    withCredentials: true, // 클라이언트 환경에서도 쿠키 포함
  });

  return response.data;
}

// Refresh Token을 포함하여 토큰 재발급 요청
export async function fetchReissueToken(
  refreshToken?: string,
): Promise<CommonResponseType<ReissueResponse>> {
  const response = await axiosForMiddleware.get("/reissue", {
    headers: {
      "Content-Type": "application/json",
      ...(refreshToken ? { Cookie: `refresh=${refreshToken}` } : {}), // 서버 환경에서 Refresh Token 포함
    },
    withCredentials: true, // 클라이언트 환경에서도 쿠키 포함
  });

  return response.data;
}

// 로그인 API 호출 => 액세스 토큰 & user 정보 반환
export async function login(email: string, password: string) {
  try {
    const response = await axiosInstance.post("/login", { email, password });
    if (response.data.code === 200 && response.data.result === "SUCCESS") {
      return response.data; // 성공 응답 반환
    } else {
      // 실패 메시지 처리
      throw new Error(response.data.message || "로그인에 실패하였습니다.");
    }
  } catch (error: any) {
    // api 호출 에러
    alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 다시 확인하세요.");
    throw error;
  }
}

// 로그아웃 API 호출
export async function logout(): Promise<void> {
  await axiosInstance.post("/logout");
}
