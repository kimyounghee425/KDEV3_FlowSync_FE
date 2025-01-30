// 프로젝트 생성 페이지

"use client";

import { Box } from "@chakra-ui/react";

import BackButton from "@/src/components/common/BackButton";
import ProjectForm from "@/src/components/pages/ProjectRegisterPage/components/ProjectForm";

export default function ProjectRegisterPage() {
  return (
    <Box
      maxW="1400px"
      w="100%"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1"
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />

      <ProjectForm />
    </Box>
  );
}
