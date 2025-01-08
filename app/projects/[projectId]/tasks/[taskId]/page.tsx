"use client";

import { Box, Text } from "@chakra-ui/react";
import { mockData } from "../../../../../src/data/task_data";
import { mockComments } from "../../../../../src/data/task_comments_data";
import TaskContent from "@/src/components/common/TaskContents";
import TaskComments from "@/src/components/common/TaskComments";
import CommentBox from "@/src/components/common/CommentBox";
import { useParams } from "next/navigation";
import BackButton from "@/src/components/common/backButton";

export default function ProjectTaskPage() {
  const taskId = useParams().taskId as string;

  const task = Object.values(mockData).find(
    (task) => task.id === Number(taskId)
  );

  const comments =
    mockComments.data
      .find((item) => item.taskId === Number(taskId))
      ?.comments.map((comment) => ({
        ...comment,
        id: comment.id.toString(),
      })) || []; // 댓글이 없으면 빈 배열

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
      <BackButton />
      {/* 글 컴포넌트 */}
      <TaskContent task={task} />

      {/* 댓글 컴포넌트 */}
      <TaskComments comments={comments} />
      <CommentBox />
    </Box>
  );
}
