// 결재 글 생성 페이지

"use client";
// 목데이터 사용

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import ArticleForm from "@/src/components/common/ArticleForm";
import { ApprovalRequestData, ProgressStep } from "@/src/types";
import { projectProgressStepApi } from "@/src/api/projects";
import { useFetchData } from "@/src/hook/useFetchData";
import FormSelectInput from "@/src/components/common/FormSelectInput";
import DropDownInfoTop from "@/src/components/common/DropDownInfoTop";
import "./edit.css";
import { useCreateApproval } from "@/src/hook/useMutationData";

export default function ProjectApprovalsNewPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("NORMAL_REQUEST");
  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";

  const { data: progressStepData } = useFetchData<ProgressStep[], [string]>({
    fetchApi: projectProgressStepApi,
    params: [resolvedProjectId],
  });

  const { mutate: createApproval, error: approvalRegisterError } =
    useCreateApproval();

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

  const handleSave = async <T extends ApprovalRequestData>(requestData: T) => {
    const response = await createApproval(Number(projectId), {
      ...requestData,
      category,
      ...(requestData.progressStepId !== undefined
        ? { progressStepId: requestData.progressStepId }
        : {}),
    });
    if (response === null) return;

    router.push(`/projects/${projectId}/approvals`);
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
        <Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={2}
          >
            <Text>요청 종류</Text>
            <DropDownInfoTop text="완료 요청은 해당 단계의 마지막 결재 글입니다." />
          </Box>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value={"NORMAL_REQUEST"}>일반 요청</option>
            <option value={"COMPLETE_REQUEST"}>완료 요청</option>
          </select>
        </Box>
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
