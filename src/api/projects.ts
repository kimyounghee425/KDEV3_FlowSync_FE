import axiosInstance from "./axiosInstance";
import { BoardResponse, ProjectProps } from "@/src/types";

export const fetchProjects = async (
  query: string = "", // 검색어
  filter: string = "", // 필터링 값
  currentPage: number, 
  pageSize: number,
): Promise<BoardResponse<ProjectProps>> => {
  const response = await axiosInstance.get("/projects", {
    params: { query, filter, currentPage, pageSize, },
  });
  return response.data;
};