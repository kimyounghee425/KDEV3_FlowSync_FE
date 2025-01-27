import axiosInstance from "@/src/api/axiosInstance";

interface PermissionsResponse {
  role: string;
}

// 사용자 권한 API 호출
export async function fetchUserPermissions(): Promise<PermissionsResponse> {
  const response = await axiosInstance.get("/auth/decode-token"); // 쿠키 기반 요청
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
