import { Box, Text } from "@chakra-ui/react";

interface ProgressStepTagProps {
  children: string;
}

// 종합 대시보드와 프로젝트 대시보드에 컬럼의 디자인을 위해 쓰이는 박스
export default function ProgressStepTag({ children }: ProgressStepTagProps) {
  return (
    <Box
      width="100%"
      height="100%"
      display="inline-flex"
      backgroundColor="#F9F9F9"
      paddingX="10px"
      paddingY="6px"
      justifyContent="center"
      alignItems="center"
      borderRadius="6px"
      fontSize={{ base: "12px", md: "14px", lg: "16px" }}
      fontWeight="500"
      letterSpacing="-0.28px"
      minWidth="60px" // 최소 너비 설정 (텍스트가 너무 작아지지 않도록)
      minHeight="30px" // 최소 높이 설정
      flexShrink={0} // 너무 작아지는 것 방지
      textAlign="center"
    >
      <Text whiteSpace="nowrap">{children}</Text>
    </Box>
  );
}
