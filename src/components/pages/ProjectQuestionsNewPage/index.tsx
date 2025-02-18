// question 글 작성 페이지

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@chakra-ui/react";
import ArticleForm from "@/src/components/common/ArticleForm";
import { createQuestionApi } from "@/src/api/RegisterArticle";
import { ProgressStep, QuestionRequestData } from "@/src/types";
import { projectProgressStepApi } from "@/src/api/projects";
import { useFetchData } from "@/src/hook/useFetchData";
import FormSelectInput from "@/src/components/common/FormSelectInput";
import { showToast } from "@/src/utils/showToast";
import "@/src/components/pages/ProjectQuestionsNewPage/edit.css";

export default function ProjectQuestionsNewPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");

  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";

  // ProgressStep 데이터 패칭
  const { data: progressStepData } = useFetchData<ProgressStep[], [string]>({
    fetchApi: projectProgressStepApi,
    params: [resolvedProjectId],
  });

  const progressStepOptions = progressStepData
    ? progressStepData.map((step) => ({
        id: Number(step.id), // key 값
        title: step.name, // 사용자에게 보이는 텍스트
        value: String(step.id), // select 요소에서 사용할 값
      }))
    : [];

  const [progressStepId, setProgressStepId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (progressStepOptions.length > 0 && progressStepId === undefined) {
      setProgressStepId(progressStepOptions[0].id);
    }
  }, [progressStepOptions]);

  const handleSave = async <T extends QuestionRequestData>(requestData: T) => {
    try {
      const response = await createQuestionApi(Number(projectId), {
        ...requestData,
        ...(requestData.progressStepId !== undefined
          ? { progressStepId: requestData.progressStepId }
          : {}),
      });
      if (response.message) {
        showToast({
          title: "요청 성공",
          description: response.message,
          type: "success",
          duration: 3000,
        });
      }
      router.push(`/projects/${projectId}/questions`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "질문 등록 중 중 오류가 발생했습니다.";

      // ✅ 토스트로 사용자에게 알림
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
      console.error("저장 실패:", error);
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
      <ArticleForm
        title={title}
        setTitle={setTitle}
        handleSave={handleSave}
        progressStepId={progressStepId ?? 0}
      >
        <FormSelectInput
          label="진행 단계"
          selectedValue={progressStepId}
          setSelectedValue={setProgressStepId}
          options={progressStepOptions}
        />
      </ArticleForm>
    </Box>
  );
}
