import axiosInstance from "./axiosInstance";
import { BoardResponse, ProjectProps } from "@/src/types";

export const fetchProjects = async (
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number
): Promise<BoardResponse<ProjectProps>> => {
  const response = await axiosInstance.get("/projects", {
    params: { query, filter, currentPage, pageSize },
  });
  return response.data;
};

export const fetchProjectInfo = async (projectId: string) => {
  const response = await axiosInstance.get(`/projects/${projectId}/projectInfo`);
  return response.data;
};

export const fetchProjectProgressCount = async (projectId: string) => {
  const response = await axiosInstance.get(`/projects/${projectId}/progressCount`);
  return response.data;
}

export const fetchProjectsStatusCount = async () => {
  const response = await axiosInstance.get("/projects/status-summary");
  return response.data;
}

export const fetchProjectTasks = async (
  projectId: string, 
  query:string = "", // 검색어 
  boardStatus:string="", // 게시글 유형
  boardCategory:string="", // 진행단계
  currentPage: number, // 현재 페이지
  pageSize: number, // 페이지 크기
) => {
  const response = await axiosInstance.get(`/projects/${projectId}/tasks`, {
    params: {query, boardStatus, boardCategory, currentPage, pageSize},
  });
  return response.data;
}
