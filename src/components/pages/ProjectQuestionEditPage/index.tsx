// question 글 수정 페이지

"use client";

import { Box } from "@chakra-ui/react";
import QuestionEditForm from "@/src/components/pages/ProjectQuestionEditPage/components/QuestionEditForm";

export default function ProjectQuestionEditPage() {
  return (
    <Box
      maxW="1000px"
      w={"100%"}
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <QuestionEditForm />
    </Box>
  );
}
