import axiosInstance from "./axiosInstance";
import { BoardResponse, ProjectProps } from "@/src/types";

export const fetchProjects = async (
  currentPage: number, 
  pageSize: number,
  query: string = "", // 검색어
  filter: string = "" // 필터링 값
): Promise<BoardResponse<ProjectProps>> => {
  const response = await axiosInstance.get("/projects", {
    params: { currentPage, pageSize, query, filter },
  });
  return response.data;
};

// 추후 개별 프로젝트 글 속성 타입 업데이트
// export const fetchProjectById = async (
//   id: string,
//   page: number,
//   pageSize: number
// ): Promise<any> => {
//   const response = await axiosInstance.get(`/projects/${id}`, {
//     params: { page, pageSize }
//   });
//   return response.data;
// };