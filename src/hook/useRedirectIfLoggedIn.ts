import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRedirectContext } from "@/src/context/RedirectContext";

export function useRedirectIfLoggedIn() {
  const router = useRouter(); // Next.js의 useRouter 훅 사용
  const { redirectPath } = useRedirectContext(); // Context에서 리다이렉트 경로 가져오기

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (token && user) {
      // 사용자가 관리자라면 관리자 대시보드 페이지로 리다이렉트
      if (user.role === "ROLE_ADMIN") {
        router.push("/admin");
      } else {
        // 사용자가 회원일 경우 회원 대시보드 페이지로 리다이렉트
        router.push(redirectPath);
      }
    }
  }, [redirectPath, router]);
}
