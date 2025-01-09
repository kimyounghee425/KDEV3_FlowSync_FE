"use server";

import { redirect } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export async function processLogin(data: LoginForm) {
  // 간단한 유효성 검사
  if (!data.email || !data.password) {
    return { error: "이메일과 비밀번호를 모두 입력하세요." };
  }

  // 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { error: "유효한 이메일 주소를 입력하세요." };
  }

  // 인증 처리 (예: API 호출 또는 데이터베이스 조회)
  const isValidUser = data.email === "user@example.com" && data.password === "password123";
  if (!isValidUser) {
    return { error: "잘못된 이메일 또는 비밀번호입니다." };
  }

  // 성공 시 리다이렉트 또는 세션 설정
  redirect("/");
  return { success: true };
}
