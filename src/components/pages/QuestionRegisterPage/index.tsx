// question 글 작성 페이지

"use client";

import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/backButton";
import TaskForm from "@/src/components/common/TaskForm";

import TaskButton from "@/src/components/common/TaskButton";

export default function QuestionRegisterPage() {

  useEffect(() => {
  }, []);

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

      <TaskForm />
      <TaskButton></TaskButton>
    </Box>
  );
}
