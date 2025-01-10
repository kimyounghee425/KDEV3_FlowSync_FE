import type { Metadata } from "next";
import { Provider } from "@/src/components/ui/provider";
import { Box, Flex } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      {/* 로그인 페이지 중앙 정렬 레이아웃 */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        minHeight="100vh"
        backgroundColor="gray.50"
        padding="3"
        overflow="hidden" // 스크롤 제거
      >
        <Box width="100%" maxW="500px" borderRadius="md" bg="white" boxShadow="lg" padding="1">
          {children}
        </Box>
      </Flex>
    </Provider>
  );
};

export default RootLayout;
