"use client";

import {
  ReactNode,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

interface SidebarContextProps {
  projectStatus: string;
  setProjectStatus: (value: string) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [projectStatus, setProjectStatus] = useState<string>("진행중 프로젝트");

  useEffect(() => {
    const savedStatus = localStorage.getItem("projectStatus");
    setProjectStatus(savedStatus as string);
  }, []);

  useEffect(() => {
    // 상태 변경 시 LocalStorage에 저장
    // TODO 다른 방법 찾아보기
    localStorage.setItem("projectStatus", projectStatus);
  }, [projectStatus]);

  return (
    <SidebarContext.Provider value={{ projectStatus, setProjectStatus }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
