// 새 글을 생성하는 페이지 new

"use client";
// 목데이터 사용

import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/backButton";
import TaskForm from "@/src/components/common/ArticleForm";
import "./edit.css";

export default function New() {
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
    </Box>
  );
}
