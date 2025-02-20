import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchReissueToken, fetchUserInfoApi } from "@/src/api/auth";
import { UserInfoResponse } from "@/src/types";

/**
 * 정적 파일 요청 및 `/login` 페이지는 미들웨어 실행 제외
 */
function shouldBypassMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") || // Next.js 정적 리소스
    pathname.startsWith("/static/") || // 직접 제공하는 정적 파일
    pathname === "/login" ||
    ["/favicon.ico", "/robots.txt", "/logo.png"].includes(pathname)
  );
}

/**
 * 로그인 페이지로 리디렉트 (쿠키 삭제 후)
 */
function handleUnauthorized(request: NextRequest) {
  console.log("Unauthorized Access → Redirecting to login");
  const res = NextResponse.redirect(new URL("/login", request.url));
  clearCookies(res);
  return res;
}

/**
 * 쿠키 삭제 함수
 */
function clearCookies(response: NextResponse) {
  response.headers.set(
    "Set-Cookie",
    [
      "access=; Path=/; HttpOnly; Secure; SameSite=None; Domain=flowssync.com; Max-Age=0",
      "refresh=; Path=/; HttpOnly; Secure; SameSite=None; Domain=flowssync.com; Max-Age=0",
    ].join(", "),
  );
}

/**
 * 쿠키 설정 함수
 */
function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  response.headers.set(
    "Set-Cookie",
    [
      `access=${accessToken}; Path=/; HttpOnly; Secure; SameSite=None; Domain=flowssync.com; Max-Age=${30 * 60}`,
      `refresh=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=None; Domain=flowssync.com; Max-Age=${24 * 60 * 60}`,
    ].join(", "),
  );
}

/**
 * 관리자 권한이 필요한 페이지 목록
 */
const adminPages = ["/admin"];

/**
 * 토큰 검증 및 리프레시 로직
 */
async function validateAndRefreshTokens(
  request: NextRequest,
): Promise<{ userInfo?: UserInfoResponse; response: NextResponse }> {
  let userInfoResponse;
  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;
  const response = NextResponse.next();

  try {
    // 1. AccessToken 검증
    if (accessToken) {
      userInfoResponse = await fetchUserInfoApi(accessToken);
      if (userInfoResponse.result === "SUCCESS") {
        return { userInfo: userInfoResponse.data, response };
      }
    }
  } catch (error: any) {
    // if (error.response?.status === 401 || error.response?.status === 403) {
    if (error.response?.status === 401) {
      console.warn("Access Token 만료 → Refresh Token 사용 시도");
    } else {
      console.error("AccessToken 검증 중 오류 발생:", error.message);
      clearCookies(response);
      return { response }; // 예기치 못한 에러 발생 시 종료
    }
  }

  try {
    // 2. RefreshToken이 있으면 AccessToken 재발급 시도
    if (refreshToken) {
      console.log("Access Token 만료됨 → Refresh Token 사용");
      const reissueResponse = await fetchReissueToken(refreshToken);

      if (reissueResponse.data?.access && reissueResponse.data?.refresh) {
        console.log("새 Access Token 발급 성공 → 다시 요청 진행");

        setAuthCookies(
          response,
          reissueResponse.data.access,
          reissueResponse.data.refresh,
        );

        // 3. 재발급된 AccessToken으로 사용자 정보 가져오기
        userInfoResponse = await fetchUserInfoApi(reissueResponse.data.access);
        if (userInfoResponse.result === "SUCCESS") {
          return { userInfo: userInfoResponse.data, response };
        }
      } else {
        console.warn("Refresh Token 없음 → 로그인 페이지로 이동");
        return { response };
      }
    }
  } catch (error: any) {
    console.error("Refresh Token 사용 중 오류 발생:", error.message);
    clearCookies(response);
  }

  try {
    // 2. Access Token 만료 → Refresh Token으로 재발급 시도
    console.log("Access Token 만료됨 → Refresh Token 사용");
    const reissueResponse = await fetchReissueToken(refreshToken);

    if (reissueResponse.data?.access && reissueResponse.data?.refresh) {
      console.log("새 Access Token 발급 성공 → 다시 요청 진행");

      // 쿠키에 새 AccessToken & RefreshToken 저장
      setAuthCookies(
        response,
        reissueResponse.data.access,
        reissueResponse.data.refresh,
      );

      // 새 Access Token으로 유저 정보 가져오기
      const userInfoResponse = await fetchUserInfoApi(
        reissueResponse.data.access,
      );
      if (userInfoResponse.result === "SUCCESS") {
        return { userInfo: userInfoResponse.data, response };
      }
    }
  } catch (error: any) {
    console.error("Refresh Token 사용 중 오류 발생:", error.message);
    clearCookies(response);
  }

  return { response }; // 모든 시도 실패 시 빈 객체 반환
}

export async function middleware(request: NextRequest) {
  // 요청 경로
  const pathname = request.nextUrl.pathname;

  // 정적 리소스 및 /login 페이지는 미들웨어 실행 제외
  if (shouldBypassMiddleware(pathname)) {
    return NextResponse.next();
  }

  // 액세스 토큰 & 리프레시 토큰 확인
  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;

  // 로그인 페이지 접근 시 처리
  if (pathname === "/login") {
    if (accessToken || refreshToken) {
      console.warn(
        "이미 로그인된 사용자가 로그인 페이지에 접근 → 홈으로 이동",
      );
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next(); // 로그인 페이지 접근 허용
  }

  const { userInfo, response } = await validateAndRefreshTokens(request);

  if (!userInfo) {
    clearCookies(response);
    return handleUnauthorized(request);
  }

  // 관리자 권한 검사를 배열을 사용하여 수행
  if (
    adminPages.some((path) => pathname.startsWith(path)) &&
    userInfo.role !== "ADMIN"
  ) {
    console.warn("권한이 부족하여 홈으로 리디렉트 됨");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 프로젝트 접근 권한 검사 (ADMIN은 검사 제외)
  if (userInfo.role !== "ADMIN" && pathname.startsWith("/projects/")) {
    const pathSegments = pathname.split("/");
    const projectId = pathSegments[2]; // `/projects/[projectId]/*` 형태에서 projectId 추출

    if (!userInfo.projectIdList.includes(Number(projectId))) {
      console.warn(`프로젝트 접근 불가 (projectId: ${projectId}) → 홈으로 이동`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    "/((?!^/login$|^/_next/|^/static/|^/favicon.ico$|^/robots.txt$).*)",
  ],
};
