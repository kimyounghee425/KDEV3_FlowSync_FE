// 결재 글 생성 페이지

"use client";
// 목데이터 사용

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";
import ArticleForm from "@/src/components/common/ArticleForm";
import { createTaskApi } from "@/src/api/RegisterArticle";
import { ApprovalRequestData } from "@/src/types";
import FormSelectInput from "@/src/components/common/FormSelectInput";
import "./edit.css";

const progressData = [
  { id: "1", title: "요구사항정의", value: "" },
  { id: "2", title: "화면설계", value: "" },
  { id: "3", title: "디자인", value: "" },
  { id: "4", title: "퍼블리싱", value: "" },
  { id: "5", title: "개발", value: "" },
  { id: "6", title: "검수", value: "" },
];

export default function ApprovalRegisterPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [progressStepId, setProgressStepId] = useState<number>(1);

  const handleSave = async <T extends ApprovalRequestData>(requestData: T) => {
    try {
      const response = await createTaskApi(Number(projectId), {
        ...requestData,
        ...(requestData.progressStepId !== undefined
          ? { progressStepId: requestData.progressStepId }
          : {}),
      });
      alert("저장이 완료되었습니다.");
      router.push(`/projects/${projectId}/tasks`);
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

      <ArticleForm title={title} setTitle={setTitle} handleSave={handleSave}>
        {/* <ProgressStepAddSection
          progressStepId={progressStepId}
          setProgressStepId={setProgressStepId}
          progressData={progressData || []}
        /> */}
        <FormSelectInput
          label="진행 단계"
          selectedValue={progressStepId}
          setSelectedValue={setProgressStepId}
          options={progressData || []}
        />
      </ArticleForm>
    </Box>
  );
}
