// 개별 댓글, 대댓글 렌더링

import { useState } from "react";
import { Box, Button, Text, Textarea, Flex } from "@chakra-ui/react";
import ReplyItem from "./ReplyItem";
import { Comment as CommentType } from "@/src/types/taskTypes";

interface CommentProps {
  comment: CommentType;
}

const CommentItem = ({ comment }: CommentProps) => {
  const [replyingTo, setReplyingTo] = useState(false); // 현재 댓글의 답글 작성 여부
  const [replyContent, setReplyContent] = useState("");

  const handleReplyClick = () => {
    if (replyingTo && replyContent.trim() !== "") {
      const confirmCancel = window.confirm(
        "이미 입력된 답글 내용을 취소 하겠습니까?"
      );
      if (!confirmCancel) return;
    }
    setReplyingTo(!replyingTo);
    setReplyContent("");
  };

  const handleCancelReply = () => {
    if (replyContent.trim() !== "") {
      const confirmCancel = window.confirm(
        "이미 입력된 답글 내용을 취소 하겠습니까?"
      );
      if (!confirmCancel) return;
    }
    setReplyingTo(false);
    setReplyContent("");
  };

  const handleReplySubmit = () => {
    console.log(`Reply to comment ${comment.id}:`, replyContent);
    setReplyingTo(false);
    setReplyContent("");
  };

  return (
    <Box mb={4} p={4} borderWidth={1} borderRadius="md">
      {comment.deletedYn === "Y" ? (
        <>
          <Text color="gray.500" fontStyle="italic">
            삭제된 댓글입니다.
          </Text>
          {/* 삭제된 댓글이지만 대댓글 렌더링 */}
          {comment.replies.length > 0 && (
            <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
              {comment.replies
                .filter((reply) => reply.deletedYn === "N")
                .map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} />
                ))}
            </Box>
          )}
        </>
      ) : (
        <>
          {/* 삭제되지 않은 댓글 렌더링 */}
          <Text fontWeight="bold">{comment.author}</Text>
          <Text fontSize="sm" color="gray.500">
            {comment.regAt}
          </Text>
          <Text mt={2}>{comment.content}</Text>
          <Button
            size="xs"
            colorScheme="blue"
            variant="outline"
            onClick={handleReplyClick}
            mt={2}
          >
            답글
          </Button>

          {/* 답글 작성 영역 */}
          {replyingTo && (
            <Box mt={4}>
              <Textarea
                placeholder="답글을 입력하세요."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                mb={2}
              />
              <Flex gap={2}>
                <Button size="sm" colorScheme="blue" onClick={handleReplySubmit}>
                  답글 작성
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelReply}
                >
                  취소
                </Button>
              </Flex>
            </Box>
          )}

          {/* 대댓글 렌더링 */}
          {comment.replies.length > 0 && (
            <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
              {comment.replies
                .filter((reply) => reply.deletedYn === "N")
                .map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} />
                ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CommentItem;
