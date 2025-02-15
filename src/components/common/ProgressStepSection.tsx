"use client";

import { useEffect, useState } from "react";
import { Flex, useBreakpointValue } from "@chakra-ui/react";
import ProgressStepButton from "@/src/components/common/ProgressStepButton";
import { Loading } from "@/src/components/common/Loading";
import { ProjectProgressStepProps } from "@/src/types";

interface ProgressStepSectionProps {
  progressStep: ProjectProgressStepProps[];
  loading: boolean;
}

/**
 * ProgressStepSection 컴포넌트
 */
export default function ProgressStepSection({
  progressStep,
  loading,
}: ProgressStepSectionProps) {
  // 현재 선택된 버튼 id 상태 (기본값은 progressData의 첫 번째 항목)
  const [selectedButtonId, setSelectedButtonId] = useState<string>(
    progressStep.length > 0 ? progressStep[0].id : "",
  );

  useEffect(() => {
    if (progressStep.length > 0 && !selectedButtonId) {
      setSelectedButtonId(progressStep[0].id);
    }
  }, [progressStep]);

  const handleStatusChange = (id: string) => {
    // 이미 선택된 버튼이라면 아무 동작도 하지 않음
    if (id === selectedButtonId) {
      return;
    }

    setSelectedButtonId(id); // 클릭된 버튼으로 상태 변경

    // progressData에서 선택된 단계의 value를 찾음
    const selectedValue = progressStep.find((item) => item.id === id)?.id || "";

    // URL 쿼리 파라미터를 수정 (progressStep 값 변경)
    const params = new URLSearchParams(window.location.search);
    params.set("progressStep", selectedValue);

    // 브라우저 히스토리(주소)를 업데이트
    history.replaceState(null, "", `?${params.toString()}`); // URL 업데이트
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      paddingX="2rem"
      paddingY="1rem"
      gap="1rem"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="md"
      mb="30px"
      flexWrap="nowrap"
      overflowX="auto"
      whiteSpace="nowrap"
    >
      {/*
        progressStep 배열을 순회하며 ProgressStepButton을 렌더링
        - text: 단계명 (예: "요구사항정의")
        - count: 현재 단계 개수
        - isSelected: 현재 선택 상태 여부
        - onClick: 클릭 시 handleStatusChange 실행
      */}
      {progressStep.map((button) => (
        <ProgressStepButton
          key={button.id}
          text={button.title}
          count={button.count || 0} // 서버에서 받아온 개수 표시
          isSelected={selectedButtonId === button.id} // 선택 상태 전달
          onClick={() => handleStatusChange(button.id)} // 클릭 핸들러 전달
        />
      ))}
    </Flex>
  );
}
