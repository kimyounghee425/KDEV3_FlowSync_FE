"use client";

import { Box, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import TaskContent from "@/src/components/common/TaskContents";
import TaskComments from "@/src/components/common/TaskComments";
import CommentBox from "@/src/components/common/CommentBox";
import BackButton from "@/src/components/common/backButton";

export default function ProjectTaskPage() {
  const { taskId } = useParams();
  console.log(taskId);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/task_mock_datas/${taskId}.json`);
        if (!response.ok) {
          throw new Error("JSON 파일을 가져오는데 실패했습니다.");
        }
        const data: Task = await response.json();
        setTask(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchData();
  }, [taskId]);

  if (error) {
    return <Box>에러 발생: {error}</Box>;
  }

  if (!task) {
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
      <TaskContent task={task} />

      {/* 댓글 섹션 */}
      <VStack align="stretch" gap={8} mt={10}>
        <TaskComments comments={task.commentList} />
        <CommentBox />
      </VStack>
    </Box>
  );
}
