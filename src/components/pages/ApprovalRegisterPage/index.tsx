// 결재 글 생성 페이지

"use client";
// 목데이터 사용

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";
import ArticleForm from "@/src/components/common/ArticleForm";
import { createTaskApi } from "@/src/api/RegisterArticle";
import { ProjectProgressStepProps, ApprovalRequestData } from "@/src/types";
import { fetchProjectQuestionProgressStepApi as fetchProjectQuestionProgressStepApi } from "@/src/api/projects";
import { useFetchData } from "@/src/hook/useFetchData";
import FormSelectInput from "@/src/components/common/FormSelectInput";
import "./edit.css";

export default function ApprovalRegisterPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");

  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";

  const { data: progressStepData } = useFetchData<
    ProjectProgressStepProps[],
    [string]
  >({
    fetchApi: fetchProjectQuestionProgressStepApi,
    params: [resolvedProjectId],
  });

  const filteredProgressSteps =
    progressStepData?.filter((step) => step.value !== "ALL") || [];

  const [progressStepId, setProgressStepId] = useState<number>(
    filteredProgressSteps.length > 0 ? Number(filteredProgressSteps[0].id) : 0,
  );

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
        <FormSelectInput
          label="진행 단계"
          selectedValue={progressStepId}
          setSelectedValue={setProgressStepId}
          options={filteredProgressSteps || []}
        />
      </ArticleForm>
    </Box>
  );
}
