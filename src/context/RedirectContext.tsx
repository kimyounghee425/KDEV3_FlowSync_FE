"use client"; // RedirectContext는 클라이언트 상태를 관리하기 때문에 클라이언트 컴포넌트로 처리해야 함

import React, { createContext, useContext, useState, ReactNode } from "react";

// RedirectContext의 타입 정의: 리다이렉트 경로와 경로 설정 함수
interface RedirectContextProps {
  redirectPath: string; // 현재 리다이렉트 경로
  setRedirectPath: (path: string) => void; // 리다이렉트 경로 설정 함수
}

// Context 생성: 기본값은 undefined로 설정하여 사용 전 오류를 감지
export const RedirectContext = createContext<RedirectContextProps | undefined>(undefined);

// Provider 컴포넌트: 하위 컴포넌트에 리다이렉트 경로를 제공
export const RedirectProvider = ({ children }: { children: ReactNode }) => {
  const [redirectPath, setRedirectPath] = useState("/"); // 기본 리다이렉트 경로 설정 (대시보드) - 일반 사용자(member) :: / , 관리자(admin) :: /admin 로 변경

  return (
    <RedirectContext.Provider value={{ redirectPath, setRedirectPath }}>
      {children} {/* 하위 컴포넌트들을 렌더링 */}
    </RedirectContext.Provider>
  );
};

// 커스텀 훅: RedirectContext를 쉽게 사용하기 위한 도우미 역할
export const useRedirectContext = () => {
  const context = useContext(RedirectContext);
  if (!context) {
    throw new Error("useRedirectContext must be used within a RedirectProvider");
  }
  return context;
};
