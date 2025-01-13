import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 환경 변수로 기본 URL 설정
  timeout: 10000, // 요청 타임아웃 설정 (10초)
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // 개발 단계에서 에러를 중앙관리하기위한 구문
    // 추후 중앙화된 로깅 도구를 사용하거나 제거
    // 에러 처리는 개별 컴포넌트에서 진행
    if (error.response?.status === 401) {
      console.error("인증 오류!");
    } else if (error.response?.status == 403) {
      console.error("403 Forbidden - 권한이 부족합니다.");
    } else if (error.response?.status >= 500) {
      console.error("500+ Server Error - 서버 오류 발생.");
    }
    return Promise.reject(error); // 에러를 호출한 컴포넌트로 전달
  }
);

export default axiosInstance;
