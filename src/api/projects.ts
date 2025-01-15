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
  const url = `/projects/${projectId}/progressCount`;
  const response = await axiosInstance.get(url);
  return response;
};

export const fetchProjectsStatusCount = async () => {
  const response = await axiosInstance.get("/projects/status-summary");
  return response;
};
