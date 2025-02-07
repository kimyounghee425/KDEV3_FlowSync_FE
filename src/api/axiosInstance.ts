import axios from "axios";
import { fetchReissueToken } from "@/src/api/auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // MSW용 환경 변수로 기본 URL 설정
  timeout: 10000, // 요청 타임아웃 설정 (10초)
  withCredentials: true,
});

// 요청 인터셉터: Content-Type 동적 설정
axiosInstance.interceptors.request.use((config) => {
  // Content-Type === multipart/form-data
  const isMultipart =
    config.headers &&
    config.headers?.get("Content-Type") === "multipart/form-data";
  // Content-Type이 지정되지 않았거나 multipart/form-data가 아닌 경우 기본값 설정
  if (!isMultipart) {
    config.headers?.set("Content-Type", "application/json");
  }
  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 🚨 리프레시 토큰 요청 중복 방지
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          refreshPromise = fetchReissueToken();
          const reissueResponse = await refreshPromise;

          if (
            reissueResponse.result === "SUCCESS" &&
            reissueResponse.data?.access
          ) {
            console.log("✅ 토큰 재발급 성공 → 기존 요청 재시도");
            return axiosInstance(originalRequest);
          } else {
            console.error("❌ Refresh Token이 만료됨 → 로그인 페이지로 이동");
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("❌ Refresh Token 요청 실패:", refreshError);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      } else {
        console.log("⏳ 이미 Refresh Token 요청 진행 중...");
        try {
          await refreshPromise;
          return axiosInstance(originalRequest);
        } catch (error) {
          console.error(
            "❌ 다른 요청도 Refresh Token 재발급 실패 → 로그인 이동",
          );
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
