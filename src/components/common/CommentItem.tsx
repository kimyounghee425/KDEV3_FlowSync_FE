import { useState } from "react";
import { Box, Button, Text, Textarea, Flex } from "@chakra-ui/react";
import ReplyItem from "./ReplyItem";
import { Comment as CommentType } from "@/src/types/taskTypes";

interface CommentProps {
  comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
  const [replyingTo, setReplyingTo] = useState<boolean>(false); // 현재 댓글의 답글 작성 여부
  const [replyContent, setReplyContent] = useState<string>("");

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
      {/* 댓글 내용 */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>
          <Text fontWeight="bold">{comment.author}</Text>
          <Box display={"flex"} alignItems="center" gap={2}>
            <Text fontSize="sm" color="gray.500">
              {comment.regAt}
            </Text>
            <Button
              size={"xs"}
              colorScheme="blue"
              variant="outline"
              onClick={handleReplyClick}
            >
              답글
            </Button>
          </Box>
          <Text mt={2}>{comment.content}</Text>
        </Box>
      </Box>

      {/* 답글 작성 영역 */}
      {replyingTo && (
        <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
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
            <Button size="sm" variant="outline" onClick={handleCancelReply}>
              취소
            </Button>
          </Flex>
        </Box>
      )}

      {/* 대댓글 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
          {comment.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Comment;
