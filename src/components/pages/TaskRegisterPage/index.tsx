// 결재 글 생성 페이지

"use client";
// 목데이터 사용

import { useState } from "react";
import { useParams } from "next/navigation";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";
import ArticleForm from "@/src/components/common/ArticleForm";
import { createTaskApi } from "@/src/api/RegisterArticle";
import ProgressStepAddSection from "@/src/components/common/ProgressStepAddSection";
import { TaskRequestData } from "@/src/types";

const progressData = [
  { id: 1, title: "요구사항정의" },
  { id: 2, title: "화면설계" },
  { id: 3, title: "디자인" },
  { id: 4, title: "퍼블리싱" },
  { id: 5, title: "개발" },
  { id: 6, title: "검수" },
];

export default function TaskRegisterPage() {
  const { projectId } = useParams();
  const [title, setTitle] = useState<string>("");
  const [progressStepId, setProgressStepId] = useState<number>(1);

  const handleSave = async (requestData: TaskRequestData) => {
    try {
      const response = await createTaskApi(Number(projectId), requestData);
      console.log("저장 성공", response.data);
      alert("저장이 완료되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

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

      <ArticleForm
        title={title}
        setTitle={setTitle}
        progressStepId={progressStepId}
        handleSave={handleSave}
      >
        <ProgressStepAddSection
          progressStepId={progressStepId}
          setProgressStepId={setProgressStepId}
          progressData={progressData}
        />
      </ArticleForm>
    </Box>
  );
}
