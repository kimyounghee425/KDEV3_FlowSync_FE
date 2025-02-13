import { Button, Text } from "@chakra-ui/react";

interface ProgressStepButtonProps {
  text: string;
  count: number;
  isSelected: boolean; // 선택 상태
  onClick: () => void; // 클릭 핸들러
}

export default function ProgressStepButton({
  text,
  count,
  isSelected,
  onClick,
}: ProgressStepButtonProps) {
  return (
    <Button
      onClick={onClick}
      width="11%"
      height="48px"
      padding="14px 16px"
      justifyContent="center"
      alignItems="center"
      borderRadius="4px"
      bg="white"
      color="black"
      overflow="hidden"
      border={isSelected ? "2px solid #D62A1C" : "1px solid #E5E5EC"} // 클릭 상태에 따라 테두리 변경
      textAlign="center"
    >
      {/* <Text>{text}</Text> */}
      <Text color={isSelected ? "#D62A1C" : "black"}>
        {text} {count}건
      </Text>{" "}
      {/* 텍스트 색상 변경 */}
    </Button>
  );
}
