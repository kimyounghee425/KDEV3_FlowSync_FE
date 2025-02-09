// 프로젝트 생성 페이지

"use client";

import { Box, Flex } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";
import ProjectForm from "@/src/components/pages/ProjectsCreatePage/components/ProjectForm";

export default function ProjectsCreatePage() {
  return (
    <Flex overflowX={"auto"}>
      <Box
        transform={"scale(0.8)"}
        maxW="1400px"
        minW={"1400px"}
        w="100%"
        mx="auto"
        mt={-150}
        p={6}
        borderWidth="1"
        borderRadius="lg"
        boxShadow="md"
      >
        <BackButton />

        <ProjectForm />
      </Box>
    </Flex>
  );
}
