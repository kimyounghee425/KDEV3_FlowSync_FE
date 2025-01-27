"use client";

import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import ProgressStepButton from "@/src/components/common/ProgressStepButton";
import { useProjectQuestionList } from "@/src/hook/useProjectQuestionList";
import { Loading } from "@/src/components/common/Loading";

interface ProgressStepSectionProps {
  fetchProgressStep: (projectId: string) => {
    progressStep: Array<{
      id: string;
      title: string;
      count: number;
    }>;
    loading: boolean;
  };
  projectId: string;
}

/**
 * ProgressStepSection 컴포넌트
 * - 프로젝트의 여러 진행 단계(요구사항정의, 디자인 등)를 버튼 형태로 표시
 * - 선택된 버튼(단계)에 따라 URL 쿼리 파라미터(progressStep)를 업데이트하고,
 *   게시판 데이터를 재조회(fetchBoardList)함
 *
 * @param projectId 프로젝트 식별자 (현재 미사용, 추후 서버 데이터 연동 시 활용 가능)
 */
export default function ProgressStepSection({
  fetchProgressStep,
  projectId,
}: ProgressStepSectionProps) {
  const { progressStep, loading } = fetchProgressStep(projectId);

  const { fetchProjectQuestionList } = useProjectQuestionList();

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
    const selectedValue =
      progressStep.find((item) => item.id === id)?.title || "";

    // URL 쿼리 파라미터를 수정 (progressStep 값 변경)
    const params = new URLSearchParams(window.location.search);
    params.set("progressStep", selectedValue);

    // 브라우저 히스토리(주소)를 업데이트 (페이지 재로드 X)
    const newUrl = `?${params.toString()}`;
    history.replaceState(null, "", newUrl); // URL 업데이트

    // 새로운 데이터 패치 (boardList 재조회)
    fetchProjectQuestionList();
  };

  if (loading) {
    return <Loading />;
  }

  // useEffect(() => {
  //   if (progressData && progressData.length > 0) {
  //     setSelectedButtonId(progressData[0].id);
  //   }
  // }, [progressData]);

  return (
    <Flex
      alignItems="center"
      width="1250px"
      padding="20px 23px"
      gap="8px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="md"
      mb="30px"
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
          count={button.count} // 서버에서 받아온 개수 표시
          isSelected={selectedButtonId === button.id} // 선택 상태 전달
          onClick={() => handleStatusChange(button.id)} // 클릭 핸들러 전달
        />
      ))}
    </Flex>
  );
}
