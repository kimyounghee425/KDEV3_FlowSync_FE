// 프로젝트 수정 페이지

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Flex } from "@chakra-ui/react";
import ProjectForm from "@/src/components/pages/ProjectsCreatePage/components/ProjectForm";
import { ProjectDetailProps } from "@/src/types";
import { fetchProjectDetailsApi } from "@/src/api/projects";

export default function ProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = String(
    Array.isArray(params.projectId) ? params.projectId[0] : params.projectId,
  );

  const [projectData, setProjectData] = useState<ProjectDetailProps | null>(
    null,
  );

  // projectId 없는 경우, 404 페이지로 리다이렉트
  useEffect(() => {
    if (!projectId) {
      router.replace("/404");
    }
  }, [projectId, router]);

  // 프로젝트 상세 데이터 가져오기
  useEffect(() => {
    const getProject = async () => {
      if (!projectId) return; // 프로젝트 ID 없는 경우 API 호출 방지

      try {
        const projectDetails = await fetchProjectDetailsApi(projectId);
        if (!projectDetails) {
          router.replace("/404"); // 데이터가 없는 경우 404 이동
          return;
        }
        setProjectData(projectDetails); // 정확한 `data` 값 저장;
      } catch (error) {
        // "프로젝트 데이터 조회 실패:"
      }
    };
    getProject(); // 함수 실행
  }, [projectId]);

  if (!projectData) {
    return <p>Loading...</p>;
  }

  return (
    <Flex justifyContent="center" width="100%">
      <Box
        maxWidth="80rem" // 최대 1280px (적당한 크기)
        width="100%"
        mx="auto"
        p="1rem"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        backgroundColor="white"
      >
        {/* 프로젝트 상태 텍스트 (생성 / 수정) */}

        <ProjectForm projectData={projectData} projectId={projectId} />
      </Box>
    </Flex>
  );
}
