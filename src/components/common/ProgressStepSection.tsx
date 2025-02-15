"use client";

import { useState } from "react";
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
  // 화면 크기에 따라 `gap` 동적 조절 (작은 화면일수록 간격 좁게)
  const gapValue = useBreakpointValue({ base: 2, md: 4, lg: 12 });

  // 현재 선택된 버튼 id 상태 (기본값은 progressData의 첫 번째 항목)
  const [selectedButtonId, setSelectedButtonId] = useState<string>(
    progressStep.length > 0 ? progressStep[0].id : "",
  );

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
      marginY="1rem"
      alignItems="center"
      justifyContent="center"
      width="100%"
      paddingY="1rem"
      gap="1.5rem"
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
