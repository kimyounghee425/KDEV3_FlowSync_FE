// question 글 수정 페이지

"use client";

import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";
import QuestionEditForm from "@/src/components/pages/QuestionEditPage/components/QuestionEditForm";

export default function QuestionRegisterPage() {
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
      <BackButton />

      <QuestionEditForm />
    </Box>
  );
}
