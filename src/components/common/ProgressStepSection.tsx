"use client";

import { Flex } from "@chakra-ui/react";
import ProgressStepButton from "./ProgressStepButton";
import { useState } from "react";

interface ProgressStepSectionProps {
  projectId: string;
}

const ProgressStepSection: React.FC<ProgressStepSectionProps> = ({
  projectId,
}) => {
  const progressData = [
    // 진행단계별 글 건수
    { id: 1, title: "전체", count: 32 },
    { id: 2, title: "요구사항정의", count: 6 },
    { id: 3, title: "화면설계", count: 6 },
    { id: 4, title: "디자인", count: 8 },
    { id: 5, title: "퍼블리싱", count: 6 },
    { id: 6, title: "개발", count: 6 },
    { id: 7, title: "검수", count: 0 },
  ];

  const [selectedButtonId, setSelectedButtonId] = useState<number>();

  const handleStatusChange = (id: number) => {
    setSelectedButtonId(id); // 클릭된 버튼으로 상태 변경
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
