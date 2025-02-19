import { Button, Text } from "@chakra-ui/react";
import { Tooltip } from "@/src/components/ui/tooltip";

interface ProgressStepButtonProps {
  text: string;
  count: number;
  color: string;
  description: string;
  isSelected: boolean; // 선택 상태
  onClick: () => void; // 클릭 핸들러
}

export default function ProgressStepButton({
  text,
  count,
  color = "#333333",
  description = "",
  isSelected,
  onClick,
}: ProgressStepButtonProps) {
  console.log("isSelected: ", isSelected);
  return (
    <Tooltip
      content={description}
      contentProps={{
        css: { "--tooltip-bg": "#00A8FF" },
      }}
      positioning={{ placement: "top" }}
    >
      <Button
        onClick={onClick}
        width="11%"
        height="3rem"
        padding="1rem"
        justifyContent="center"
        alignItems="center"
        borderRadius="4px"
        bg={isSelected ? "blue.100" : "white"}
        color="black"
        border={isSelected ? "2px solid blue.500" : "1px solid #E5E5EC"} // 선택 상태일 때 테두리 변경
        cursor={isSelected ? "default" : "pointer"} // 선택된 상태에서는 커서 변경
        _hover={isSelected ? {} : { backgroundColor: "gray.100" }} // 선택된 상태에서는 hover 효과 제거
      >
        {/* <Text>{text}</Text> */}
        <Text fontWeight="bold" color={color}>
          {text} {count}건
        </Text>{" "}
        {/* 텍스트 색상 변경 */}
      </Button>
    </Tooltip>
  );
}
