// TODO 1. axios 사용해 json 받아오기
// TODO 2. JSON 파일 data 안으로 옮기기
// TODO 3. 잘 리팩토링하기.

"use client";

import { Box, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import TaskContent from "@/src/components/common/TaskContent";
import TaskComments from "@/src/components/common/TaskComments";
import CommentBox from "@/src/components/common/CommentBox";
import BackButton from "@/src/components/common/backButton";
import axiosInstance from "@/src/api/axiosInstance";

export default function ProjectTaskPage() {
  const { taskId } = useParams();

  interface Reply {
    id: number;
    author: string;
    content: string;
    regAt: string;
  }

  interface Comment {
    id: number;
    author: string;
    content: string;
    regAt: string;
    replies: Reply[];
  }

  interface ContentBlock {
    type: "text" | "image";
    data: string | { src: string }; // alt 속성 제거
  }

  interface Task {
    title: string;
    author: string;
    boardCategory: string;
    regAt: string;
    editAt: string;
    content: ContentBlock[]; // ContentBlock 인터페이스 사용
    file: string[]; // 첨부파일
    parent?: {
      title: string;
    };
    commentList: Comment[];
  }

  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axiosInstance.get<Task>(`/projects/1/tasks/${taskId}`);
        setTask(response.data); // JSON 데이터를 상태로 저장
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

    fetchTaskData();
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
