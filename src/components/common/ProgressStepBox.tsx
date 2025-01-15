import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";

interface ProgressStepProps {
  text: string;
  count: number;
}

export default function ProgressStepBox({ text, count }: ProgressStepProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected((prev) => !prev); // 클릭 시 상태를 토글
  };

  return (
    <Button
      onClick={handleClick}
      width="164px"
      height="48px"
      padding="14px 16px"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="4px"
      bg="white"
      color="black"
      border={isSelected ? "2px solid #D62A1C" : "1px solid #E5E5EC"} // 클릭 상태에 따라 테두리 변경
    >
      <Text>{text}</Text>
      <Text color={isSelected ? "#D62A1C" : "black"}>{count}건</Text>{" "}
      {/* 텍스트 색상 변경 */}
    </Button>
  );
}
