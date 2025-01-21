// 새 글을 생성하는 페이지 new

"use client";
// 목데이터 사용
import { new_task_data } from "@/src/data/new_task_data";
import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/backButton";
import TaskForm from "@/src/components/common/TaskForm";
import "./edit.css"
export default function New() {
  const [author, setAuthor] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<string>("");

  
  useEffect(() => {
    setAuthor(new_task_data.userName);
    const currentDate = new Date().toISOString();
    setCreatedDate(currentDate);
  }, []);
  // console.log(createdDate)
  

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

      <TaskForm author={author} createdDate={createdDate} />
    </Box>
  );
}