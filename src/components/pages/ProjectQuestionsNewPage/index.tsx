// question 글 작성 페이지

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@chakra-ui/react";
import ArticleForm from "@/src/components/common/ArticleForm";
import { ProgressStep, QuestionRequestData } from "@/src/types";
import { projectProgressStepApi } from "@/src/api/projects";
import { useFetchData } from "@/src/hook/useFetchData";
import FormSelectInput from "@/src/components/common/FormSelectInput";
import "@/src/components/pages/ProjectQuestionsNewPage/edit.css";
import { useCreateQuestion } from "@/src/hook/useMutationData";

export default function ProjectQuestionsNewPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");

  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";

  const { mutate: createQuestion, error: QuestionRegisterError } =
    useCreateQuestion();

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
    const response = createQuestion(Number(projectId), {
      ...requestData,
      ...(requestData.progressStepId !== undefined
        ? { progressStepId: requestData.progressStepId }
        : {}),
    });
    if (response === null) return;
    router.push(`/projects/${projectId}/questions`);
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
