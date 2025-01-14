"use client";

import { Box, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import TaskContent from "@/src/components/common/TaskContent";
import TaskComments from "@/src/components/common/TaskComments";
import CommentBox from "@/src/components/common/CommentBox";
import BackButton from "@/src/components/common/backButton";
import axiosInstance from "@/src/api/axiosInstance";
import { Task, ContentBlock, Comment, Reply } from "@/src/types/taskTypes";

// fetchTaskData 분리
const fetchTaskData = async (taskId: string): Promise<Task> => {
  const response = await axiosInstance.get<Task>(`/projects/1/tasks/${taskId}`);
  return response.data;
}

export default function ProjectTaskPage() {
  const { taskId } = useParams() as { taskId: string };

  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await fetchTaskData(taskId);
        setTask(data); // JSON 데이터를 상태로 저장
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 가져오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  if (error) {
    return <Box>에러 발생: {error}</Box>;
  }

  if (loading) {
    return <Box>로딩 중...</Box>;
  }

  return (
    <Box
      maxW="1000px"
      w="100%"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />

      {/* 게시글 내용 */}
      {task && <TaskContent task={task} />}

      {/* 댓글 섹션 */}
      <VStack align="stretch" gap={8} mt={10}>
        {task && <TaskComments comments={task.commentList} />}
        <CommentBox />
      </VStack>
    </Box>
  );
}