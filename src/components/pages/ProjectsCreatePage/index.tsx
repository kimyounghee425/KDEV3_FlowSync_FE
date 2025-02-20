"use client";

import { Box, Flex } from "@chakra-ui/react";
import ProjectForm from "@/src/components/pages/ProjectsCreatePage/components/ProjectForm";

export default function ProjectsCreatePage() {
  return (
    <Flex justifyContent="center" width="100%">
      <Box
        maxWidth="900px" // 최대 1280px (적당한 크기)
        width="100%"
        mx="auto"
        p="1rem"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        backgroundColor="white"
      >
        {/*  프로젝트 상태 텍스트 (생성 / 수정) */}
        <ProjectForm />
      </Box>
    </Flex>
  );
}
