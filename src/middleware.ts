import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchReissueToken, fetchUserInfo } from "@/src/api/auth";
import { UserInfoResponse } from "./types";

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
function handleUnauthorized(request: NextRequest) {
  console.log("🔹 Unauthorized Access → Redirecting to login");
  const res = NextResponse.redirect(new URL("/login", request.url));
  res.headers.set(
    "Set-Cookie",
    [
      "access=; Path=/; HttpOnly; Secure; SameSite=none; Max-Age=0",
      "refresh=; Path=/; HttpOnly; Secure; SameSite=none; Max-Age=0",
    ].join(", "),
  );
  return res;
}

/**
 * 🔄 토큰 검증 및 리프레시 로직
 */
async function validateAndRefreshTokens(
  request: NextRequest,
): Promise<{ userInfo?: UserInfoResponse; response?: NextResponse }> {
  let userInfoResponse;
  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;
  const response = NextResponse.next();

  if (accessToken) {
    userInfoResponse = await fetchUserInfo(accessToken);
    if (userInfoResponse.result === "SUCCESS") {
      return { userInfo: userInfoResponse.data, response };
    }
  }

  if (refreshToken) {
    console.log("🔄 Access Token 만료됨 → Refresh Token 사용");
    const reissueResponse = await fetchReissueToken(refreshToken);

    console.log("🔹 Reissue Response:", reissueResponse);

    if (
      reissueResponse.result === "SUCCESS" &&
      reissueResponse.data?.access &&
      reissueResponse.data?.refresh
    ) {
      console.log("✅ 새 Access Token 발급 성공 → 다시 요청 진행");

      // 클라이언트의 쿠키를 업데이트
      response.cookies.set("access", reissueResponse.data.access, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        domain: "flowssync.com",
        maxAge: 86400,
      });

      response.cookies.set("refresh", reissueResponse.data.refresh, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        domain: "flowssync.com",
        maxAge: 86400,
      });

      userInfoResponse = await fetchUserInfo(reissueResponse.data.access);

      if (userInfoResponse.result === "SUCCESS") {
        console.log(userInfoResponse);
        return { userInfo: userInfoResponse.data, response };
      }
    }
  }

  return {}; // ❌ 모든 시도 실패 시 빈 객체 반환
}

export async function middleware(request: NextRequest) {
  return NextResponse.next();
  // 요청 경로
  const pathname = request.nextUrl.pathname;

  // 정적 리소스 및 /login 페이지는 미들웨어 실행 제외
  if (shouldBypassMiddleware(pathname)) {
    return NextResponse.next();
  }

  const { userInfo, response } = await validateAndRefreshTokens(request);

  if (!userInfo) {
    return handleUnauthorized(request);
  }

  // 관리자 권한 없으면 홈으로 이동
  if (pathname.startsWith("/admin") && userInfo.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // `x-user-role` 헤더 추가하여 서버 컴포넌트에서 사용 가능하도록 설정
  response?.headers.set("x-user-id", userInfo.id);
  response?.headers.set("x-user-role", userInfo.role);
  return response;
}

export const config = {
  matcher: [
    "/((?!^/login$|^/_next/|^/static/|^/favicon.ico$|^/robots.txt$).*)",
  ],
};
