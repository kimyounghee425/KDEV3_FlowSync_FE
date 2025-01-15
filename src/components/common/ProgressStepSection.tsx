"use client";

import { Box, Flex } from "@chakra-ui/react";
import ProgressBox from "./ProgressStepBox";
import { Loading } from "./Loading";
import { useProgressData } from "@/src/hook/useProgressData";

interface ProgressStepSectionProps {
  projectId: string;
}

const ProgressStepSection: React.FC<ProgressStepSectionProps> = ({
  projectId,
}) => {
  const { data, loading, error } = useProgressData(projectId);

  if (loading) {
    return <Loading />; // 로딩 중 표시
  }

  if (error) {
    return <Box>Error: {error}</Box>; // 에러 메시지 표시
  }

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
      {data.map((item) => (
        <ProgressBox key={item.id} text={item.title} count={item.count} />
      ))}
    </Flex>
  );
};

export default ProgressStepSection;
