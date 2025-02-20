import axios from "axios";

// 미들웨어 전용 axios 인스턴스 (인터셉터 없음)
export const axiosForMiddleware = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 자동으로 쿠키 포함
});