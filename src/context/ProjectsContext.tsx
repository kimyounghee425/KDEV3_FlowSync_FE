import React, { createContext, useContext, useState } from "react";
import { fetchProjects } from "@/src/api/projects";
import { BoardResponse, PaginationInfo, ProjectProps } from "@/src/types";

interface ProjectsContextValue {
  query: string;
  setQuery: (query: string) => void;
  input: string;
  setInput: (input: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  projectList: ProjectProps[];
  loading: boolean;
  paginationInfo?: PaginationInfo;
  fetchData: (page?: number, pageSize?: number) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export const ProjectsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [query, setQuery] = useState<string>(""); // 쿼리용 상태
  const [input, setInput] = useState<string>(""); // 실시간 검색어 상태
  const [filter, setFilter] = useState<string>("전체");
  const [projectList, setProjectList] = useState<ProjectProps[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>();
  const [loading, setLoading] = useState(false);

  // 프로젝트 목록을 패칭해오는 함수
  const fetchData = async (page: number = 1, pageSize: number = 5) => {
    setLoading(true);
    try {
      const response: BoardResponse<ProjectProps> = await fetchProjects(
        query,
        filter,
        page - 1, // 서버에서 0-indexed 페이지를 사용
        pageSize
      );
      setProjectList(response.data);
      setPaginationInfo(response.meta);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        filter,
        setFilter,
        query,
        setQuery,
        input,
        setInput,
        projectList,
        loading,
        paginationInfo,
        fetchData,
      }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectsData = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useFilter must be used within a ProjectsFilterProvider");
  }
  return context;
};
