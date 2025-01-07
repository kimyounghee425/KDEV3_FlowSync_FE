import axiosInstance from "./axiosInstance";

interface PermissionsResponse {
  role: string;
}

// 사용자 권한 API 호출
export const fetchUserPermissions = async (): Promise<PermissionsResponse> => {
  const response = await axiosInstance.get("/auth/decode-token"); // 쿠키 기반 요청
  return response.data;
};

// 로그인 API 호출
export const login = async (email: string, password: string): Promise<void> => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  console.log(response.data.message); // 성공 메시지 출력
};

// 로그아웃 API 호출
export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
  console.log("로그아웃 성공!");
};