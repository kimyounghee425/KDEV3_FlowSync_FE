import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchReissueToken, fetchUserInfo } from "@/src/api/auth";
import { RSC_HEADER } from "next/dist/client/components/app-router-headers";

/**
 * 정적 파일 요청 및 `/login` 페이지는 미들웨어 실행 제외
 */
function shouldBypassMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") || // Next.js 정적 리소스
    pathname.startsWith("/static/") || // 직접 제공하는 정적 파일
    pathname === "/favicon.ico" || // 파비콘 요청
    pathname === "/robots.txt" || // SEO 관련 파일 요청
    pathname === "/login" // 로그인 페이지 (무한 리다이렉트 방지)
  );
}

/**
 * 로그인 페이지로 리다이렉트
 */
function redirectToLogin(request: NextRequest) {
  console.log("🔹 No Access Token or Unauthorized → Redirecting to login");
  const res = NextResponse.redirect(new URL("/login", request.url));
  res.cookies.delete("access");
  res.cookies.delete("refresh");
  return res;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("📍 요청 경로:", pathname);

  // 정적 리소스 및 /login 페이지는 미들웨어 실행 제외
  if (shouldBypassMiddleware(pathname)) {
    console.log("✅ 정적 파일 또는 /login 페이지 → 미들웨어 실행 안함");
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access")?.value;
  console.log("🔹 Access Token:", accessToken);
  const refreshToken = request.cookies.get("refresh")?.value;
  console.log("🔹 Refresh Token:", refreshToken);

  // 로그인 필요: 토큰이 없으면 로그인 페이지로 이동
  if (!accessToken) {
    return redirectToLogin(request);
  }

  // 사용자 정보 조회
  let response = await fetchUserInfo(accessToken);
  
  // Access Token 만료 시 Refresh Token으로 재발급 시도
  if (response.result !== "SUCCESS") {
    console.log("🔄 Access Token 만료됨 → Refresh Token 사용");
    
    const reissueResponse = await fetchReissueToken(refreshToken);
    console.log("🔹 Token Reissue Response:", reissueResponse);

    // 새 Access Token 발급 성공 → 다시 `fetchUserInfo` 요청
    if (reissueResponse.result === "SUCCESS") {
      console.log("✅ 새 Access Token 발급 성공 → 다시 요청 진행");
      response = await fetchUserInfo();

      // 새 토큰 발급 후에도 실패 시 로그인 페이지 이동
      if (response.result !== "SUCCESS") return redirectToLogin(request);

      return NextResponse.next();
    }

    // Refresh Token 만료 시 로그인 페이지 이동
    console.log("❌ Refresh Token 만료 → 로그인 페이지로 이동");
    return redirectToLogin(request);
  }

  const userRole = response.data.role;
  console.log("🔹 User Role:", userRole);

  const userId = response.data.id;
  console.log("🔹 User Id:", userId);

  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    console.log("🚫 관리자 권한 없음 → 홈으로 이동");
    return NextResponse.redirect(new URL("/", request.url));
  }
  // `x-user-role` 헤더 추가하여 서버 컴포넌트에서 사용 가능하도록 설정
  const res = NextResponse.next();
  res.headers.set("x-user-id", userId);
  res.headers.set("x-user-role", userRole);
  return res;
}

export const config = {
  matcher: [
    "/((?!^/login$|^/_next/|^/static/|^/favicon.ico$|^/robots.txt$).*)",
  ],
};
