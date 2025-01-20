"use client";

import { Flex } from "@chakra-ui/react";
import ProgressStepButton from "./ProgressStepButton";
import { useState } from "react";
import { useProjectBoard } from "@/src/hook/useProjectBoard";

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

const ProgressStepSection: React.FC<ProgressStepSectionProps> = ({
  projectId,
}) => {
  const { progressStep, fetchBoardList } = useProjectBoard();

  const [selectedButtonId, setSelectedButtonId] = useState<string>(
    progressData[0].id
  );

  const handleStatusChange = (id: string) => {
    setSelectedButtonId(id); // 클릭된 버튼으로 상태 변경

    const selectedValue =
      progressData.find((item) => item.id === id)?.value || "";

    const params = new URLSearchParams(window.location.search);
    params.set("progressStep", selectedValue);
    const newUrl = `?${params.toString()}`;
    history.replaceState(null, "", newUrl); // URL 업데이트
    fetchBoardList(); // 새로운 데이터 패치
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
      mb="30px">
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
};

export default ProgressStepSection;
