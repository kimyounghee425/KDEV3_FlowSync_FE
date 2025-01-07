import axiosInstance from "./axiosInstance";
import { BoardResponse, ProjectProps } from "@/src/types";

export const fetchProjects = async (
  currentPage: number, 
  pageSize: number
): Promise<BoardResponse<ProjectProps>> => {
  console.log("Fetching projects with params:", { currentPage, pageSize });
  
  const response = await axiosInstance.get("/projects", {
     params: { currentPage, pageSize }
  });
  return response.data;
};

// 추후 개별 프로젝트 글 속성 타입 업데이트
export const fetchProjectById = async (
  id: string,
  page: number,
  pageSize: number
): Promise<any> => {
  const response = await axiosInstance.get(`/projects/${id}`, {
    params: { page, pageSize }
  });
  return response.data;
};