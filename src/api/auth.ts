import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

interface PermissionsResponse {
  role: string;
}
interface DecodedToken {
  name: string;
  email: string;
  role: string;
  exp: number; // 만료 시간 (Unix timestamp)
}

// 사용자 권한 API 호출
export const fetchUserPermissions = async (): Promise<PermissionsResponse> => {
  const response = await axiosInstance.get("/auth/decode-token"); // 쿠키 기반 요청
  return response.data;
};

// 로그인 API 호출 => 액세스 토큰 & user 정보 반환
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/login", { email, password });
  const token = response.headers["authorization"]; // Access Token (string 타입)
  if (!token) {
    throw new Error("Authorization 헤더에 토큰이 없습니다.");
  }
  const decodedToken: DecodedToken = jwtDecode(token); // JWT 액세스 토큰 deCoding
  return {
    token, // string
    user: {
      name: decodedToken.name,
      email: decodedToken.email,
      role: decodedToken.role,
      exp: decodedToken.exp,
    },
  };
};

// 로그아웃 API 호출
export const logout = async (): Promise<void> => {
  await axiosInstance.post("/logout");
  console.log("로그아웃 성공!");
};

// export const fetchUserInfo = async () => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (!accessToken) {
//     throw new Error("Access Token이 로컬스토리지에 없습니다.");
//   }
//   // Authorization 헤더에 Access Token 추가
//   const response = await axiosInstance.get("/user-info", {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   return response.data; // 사용자 정보 반환
// };
