"use server";

import members from "@/src/data/members_mock_data.json";
import { redirect } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export async function processLogin(data: LoginForm): Promise<void> {
  // 간단한 유효성 검사
  if (!data.email || !data.password) {
    throw new Error("이메일과 비밀번호를 모두 입력하세요.");
  }

  // 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("유효한 이메일 주소를 입력하세요.");
  }

  // Mock 데이터에서 사용자 찾기
  const user = members.data.find(member => member.email === data.email && member.pw === data.password);

  if (!user) {
    throw new Error("잘못된 이메일 또는 비밀번호입니다.");
  }

  // 로그인 성공 시 리다이렉트
  redirect("/"); // 성공 시 서버에서 대시보드로 리다이렉트
}
