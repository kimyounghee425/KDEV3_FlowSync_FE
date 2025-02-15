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
  console.log("isSelected: ", isSelected);
  return (
    <Button
      onClick={onClick}
      width="11%"
      height="3rem"
      padding="1rem"
      justifyContent="center"
      alignItems="center"
      borderRadius="1rem"
      bg="white"
      color="black"
      border={isSelected ? "2px solid blue.500" : "1px solid #E5E5EC"} // 선택 상태일 때 테두리 변경
      cursor={isSelected ? "default" : "pointer"} // 선택된 상태에서는 커서 변경
      _hover={isSelected ? {} : { backgroundColor: "gray.100" }} // 선택된 상태에서는 hover 효과 제거
    >
      {/* <Text>{text}</Text> */}
      <Text fontWeight="bold">
        {text} {count}건
      </Text>{" "}
      {/* 텍스트 색상 변경 */}
    </Button>
  );
}
