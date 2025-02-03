"use client";

import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";

export default function NoticeRegisterPage() {
  return (
    <Box
      maxW="1000px"
      w={"100%"}
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />
    </Box>
  );
}
