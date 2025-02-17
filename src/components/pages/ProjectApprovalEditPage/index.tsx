// question 글 수정 페이지
"use client";

import { Box } from "@chakra-ui/react";
import ApprovalEditForm from "@/src/components/pages/ProjectApprovalEditPage/components/ApprovalEditForm";

export default function ProjectApprovalEditPage() {
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
      <ApprovalEditForm />
    </Box>
  );
}
