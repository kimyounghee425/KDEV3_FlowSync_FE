"use client";

import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import ProgressStepButton from "@/src/components/pages/projectTasksPage/components/ProgressStepButton";
import { useProjectQuestionsList } from "@/src/hook/useProjectQuestionsList";

interface ProgressStepSectionProps {
  projectId: string;
}

const progressData = [
  { id: "1", title: "전체", value: "", count: 32 },
  { id: "2", title: "요구사항정의", value: "CONTRACT", count: 6 },
  { id: "3", title: "화면설계", value: "INPROGRESS", count: 6 },
  { id: "4", title: "디자인", value: "COMPLETED", count: 8 },
  { id: "5", title: "퍼블리싱", value: "MAINTENANCE", count: 6 },
  { id: "6", title: "개발", value: "PAUSED", count: 6 },
  { id: "7", title: "검수", value: "DELETED", count: 0 },
];

/**
 * ProgressStepSection 컴포넌트
 * - 프로젝트의 여러 진행 단계(요구사항정의, 디자인 등)를 버튼 형태로 표시
 * - 선택된 버튼(단계)에 따라 URL 쿼리 파라미터(progressStep)를 업데이트하고,
 *   게시판 데이터를 재조회(fetchBoardList)함
 *
 * @param projectId 프로젝트 식별자 (현재 미사용, 추후 서버 데이터 연동 시 활용 가능)
 */
export default function ProgressStepSection({
  projectId,
}: ProgressStepSectionProps) {
  // 커스텀 훅: 게시판 정보(검색, 필터, 데이터 재조회 등)를 관리
  const { progressStep, fetchBoardList } = useProjectQuestionsList();

  // 현재 선택된 버튼 id 상태 (기본값은 progressData의 첫 번째 항목)
  const [selectedButtonId, setSelectedButtonId] = useState<string>(
    progressData[0].id,
  );

  /**
   * 버튼 클릭 시 호출되는 핸들러:
   * - 선택한 버튼의 id를 상태(selectedButtonId)에 저장
   * - 해당 id에 대응하는 value를 URL 쿼리 파라미터(progressStep)에 반영
   * - fetchBoardList()로 새 데이터 재요청
   */
  const handleStatusChange = (id: string) => {
    setSelectedButtonId(id); // 클릭된 버튼으로 상태 변경

    // progressData에서 선택된 단계의 value를 찾음
    const selectedValue =
      progressData.find((item) => item.id === id)?.value || "";

    // URL 쿼리 파라미터를 수정 (progressStep 값 변경)
    const params = new URLSearchParams(window.location.search);
    params.set("progressStep", selectedValue);

    // 브라우저 히스토리(주소)를 업데이트 (페이지 재로드 X)
    const newUrl = `?${params.toString()}`;
    history.replaceState(null, "", newUrl); // URL 업데이트

    // 새로운 데이터 패치 (boardList 재조회)
    fetchBoardList();
  };

  // const { progressData, loading, error } = useProgressData(projectId);

  // useEffect(() => {
  //   if (progressData && progressData.length > 0) {
  //     setSelectedButtonId(progressData[0].id);
  //   }
  // }, [progressData]);

  // if (loading) {
  //   return <Loading />; // 로딩 중 표시
  // }

  // if (error) {
  //   return <Box>Error: {error}</Box>; // 에러 메시지 표시
  // }

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
        progressData 배열을 순회하며 ProgressStepButton을 렌더링
        - text: 단계명 (예: "요구사항정의")
        - count: 현재 단계 개수
        - isSelected: 현재 선택 상태 여부
        - onClick: 클릭 시 handleStatusChange 실행
      */}
      {progressData.map((button) => (
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
