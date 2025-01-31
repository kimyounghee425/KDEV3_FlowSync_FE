"use client";

import {
  ReactNode,
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";

interface SidebarContextProps {
  selectedProjectFilter: string;
  setSelectedProjectFilter: (value: string) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [selectedProjectFilter, setSelectedProjectFilter] =
    useState<string>("진행중 프로젝트");

  useEffect(() => {
    const savedFilter = localStorage.getItem("selectedProjectFilter");
    if (savedFilter) {
      setSelectedProjectFilter(savedFilter);
    }
  }, []);

  // 🔹 상태 변경 시 localStorage 업데이트
  const handleFilterChange = (filter: string) => {
    setSelectedProjectFilter(filter);
    localStorage.setItem("selectedProjectFilter", filter);
  };

  return (
    <SidebarContext.Provider
      value={{
        selectedProjectFilter,
        setSelectedProjectFilter: handleFilterChange,
      }}
    >
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
