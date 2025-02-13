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

  const handleSave = async () => {
    if (!commentText.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    try {
      const requestData = { content: commentText };
      let responseData: CommentApiResponse | undefined;

      if (pathname.includes("/questions")) {
        responseData = await registerComment(
          Number(projectId),
          requestData,
          Number(questionId),
          undefined,
          parentId ? Number(parentId) : undefined,
        );
      } else if (pathname.includes("/approvals")) {
        responseData = await registerComment(
          Number(projectId),
          requestData,
          undefined, // questionId는 undefined로 전달
          Number(approvalId),
          parentId ? Number(parentId) : undefined,
        );
      }
      if (responseData?.result === "SUCCESS") {
        console.log(responseData.result);
        setCommentIsWritten((prev: boolean) => !prev);
        setCommentText("");
        if (setIsReplying) setIsReplying(false);
      }
    } catch (error) {
      console.log("댓글 등록 실패 : ", error);
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
