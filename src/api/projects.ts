import axiosInstance from "./axiosInstance";
import { BoardResponseType, ProjectPropsType } from "@/src/types";

export const fetchProjects = async (
  keyword: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number,
  pageSize: number
): Promise<BoardResponseType<ProjectPropsType>> => {
  const response = await axiosInstance.get("/projects", {
    params: { keyword, filter, currentPage, pageSize },
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

export const fetchProjectBoard = async (
  projectId: string,
  keyword: string = "",
  progressStep: string = "",
  boardStatus:string = "", // 게시글 상태
  boardCategory:string = "", // 게시글 유형
  currentPage: number, // 현재 페이지
  pageSize: number, // 페이지 크기
) => {
  // const response = await axiosInstance.get(`/projects/${projectId}/tasks`, {
  const response = await axiosInstance.get(`/posts`, {
    params: {keyword, progressStep, boardStatus, boardCategory, currentPage, pageSize},
  });
  return response.data;
}
