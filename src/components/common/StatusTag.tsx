import { Box, Text } from "@chakra-ui/react";

interface StatusTagProps {
  children: string;
}

const COLOR_MAP: Record<string, string> = {
  진행중: "#21A366",
  기본: "#505050", // 기본 색상
  활성화: "#3D9F65",
  비활성화: "#B0B0B0",
  승인: "#19BC97",
  완료결재: "#00a8ff",
};

// 관리단계(진행중, 계약 등)에 대한 CSS 변수 매핑
const STATUS_KEYS: Record<string, string> = {
  계약: "contract",
  진행중: "in_progress",
  납품완료: "completed",
  하자보수: "maintenance",
  일시중단: "paused",
  삭제: "deleted",
};

// 종합 대시보드와 프로젝트 대시보드에 컬럼의 디자인을 위해 쓰이는 박스
export default function StatusTag({ children }: StatusTagProps) {
  const statusKey = STATUS_KEYS[children] || "default"; // 매핑된 키를 가져옴
  const colorVar = `var(--${statusKey}-color, #505050)`; // CSS 변수에서 가져오고 없으면 기본값
  // const color = COLOR_MAP[children] || COLOR_MAP["기본"];
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="inline-flex"
        backgroundColor="#F9F9F9"
        paddingX="10px"
        paddingY="6px"
        justifyContent="center"
        alignItems="center"
        borderRadius="6px"
        color={colorVar}
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
    </Box>
  );
}
