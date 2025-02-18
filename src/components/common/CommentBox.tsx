import { Button, Textarea, Box, Text, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { registerComment } from "@/src/api/registerComment";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { CommentApiResponse } from "@/src/types";

interface CommentBoxProps {
  parentId?: number;
  setIsReplying?: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentIsWritten: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommentBox({
  parentId,
  setIsReplying,
  setCommentIsWritten,
}: CommentBoxProps) {
  const { projectId, questionId, approvalId } = useParams() as {
    projectId: string;
    questionId?: string;
    approvalId?: string;
  };

  const [commentText, setCommentText] = useState<string>("");
  const pathname = usePathname();

  // API 경로를 미리 구성
  let apiPath = "";
  if (pathname.includes("/questions") && questionId) {
    apiPath = `/projects/${projectId}/questions/${questionId}/comments`;
  } else if (pathname.includes("/approvals") && approvalId) {
    apiPath = `/projects/${projectId}/approvals/${approvalId}/comments`;
  }

  // 대댓글(답글)인 경우
  if (parentId) {
    apiPath += `/${parentId}/recomments`;
  }

  const handleSave = async () => {
    if (!commentText.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    try {
      const requestData = { content: commentText };

      if (!apiPath) {
        console.error("댓글 API 경로가 올바르지 않습니다.");
        return;
      }

      const responseData: CommentApiResponse = await registerComment(
        apiPath, // API 경로를 직접 전달
        requestData,
      );

      if (responseData?.result === "SUCCESS") {
        setCommentIsWritten((prev: boolean) => !prev);
        setCommentText("");
        if (setIsReplying) setIsReplying(false);
      }
    } catch (error) {
      console.error("댓글 등록 실패 : ", error);
    }
  };

  return (
    <Box>
      <Text color={"gray.400"}>{`${commentText.length} / 250`}</Text>
      <Textarea
        placeholder="댓글을 입력하세요."
        onChange={(e) => setCommentText(e.target.value)}
        value={commentText}
        maxLength={250}
        maxHeight={"100px"}
      />
      <Flex justifyContent="flex-end">
        <Button
          mt={2}
          onClick={handleSave}
          mr={4}
          backgroundColor="#00a8ff"
          color="white"
          padding="1rem"
        >
          댓글 작성
        </Button>
      </Flex>
    </Box>
  );
}
