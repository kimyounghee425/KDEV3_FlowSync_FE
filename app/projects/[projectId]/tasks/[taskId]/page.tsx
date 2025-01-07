"use client";

import { Box, Text } from "@chakra-ui/react";
import { mockData } from "./data/mockData";
import { mockComments } from "./data/mockComments";
import TaskContent from "@/components/common/TaskContents";
import TaskComments from "@/components/common/TaskComments";
import { useParams } from "next/navigation";

export default function ProjectTaskPage() {
const taskId = useParams().taskId as string;

  const task = Object.values(mockData).find(
    (task) => task.id === Number(taskId)
  );

//   console.log(mockComments[2])

  const comments = mockComments[taskId];

  if (!task) {
    return <Text>페이지를 찾을 수 없습니다.</Text>;
  }

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
      {/* 글 컴포넌트 */}
      <TaskContent task={task} />

      {/* 댓글 컴포넌트 */}
      <TaskComments comments={comments} />
    </Box>
  );
}
