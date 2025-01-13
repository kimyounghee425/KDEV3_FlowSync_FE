import { useState } from "react";
import { Box, Button, Text, Flex, Input, Textarea } from "@chakra-ui/react";

interface Comment {
  id: number;
  author: string;
  regAt: string;
  content: string;
  replies?: Comment[];
}
interface TaskCommentsProps {
  comments: Comment[];
}

const TaskComments = ({ comments }: TaskCommentsProps) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");

  const handleReplyClick = (commentId: number) => {
    if (
      replyingTo !== null &&
      replyContent.trim() !== "" &&
      replyingTo !== commentId
    ) {
      // 이미 입력된 내용 있으면 알림창 띄움
      const confirmCancel = window.confirm(
        "이미 입력된 답글 내용을 취소 하겠습니까?"
      );
      if (!confirmCancel) {
        return;
      }
    }

    if (commentId === replyingTo) {
      // 동일 답글 버튼 다시 클릭 시 답글 상태 취소
      setReplyingTo(null);
    } else {
      // 다른 댓글의 답글 버튼 누를 시 이전 답글 내용 초기화
      setReplyContent("");
      setReplyingTo(commentId);
    }
  };

  const handleCancelReply = () => {
    if (replyContent.trim() !== "") {
      const confirmCancel = window.confirm(
        "이미 입력된 답글 내용을 취소 하겠습니까?"
      );
      if (!confirmCancel) {
        return;
      }
    }
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleReplySubmit = (commentId: number) => {
    console.log(`Reply to comment ${commentId}:`, replyContent);
    setReplyContent("");
    setReplyingTo(null);
  };

  return (
    <Box>
      <Box
        my={4}
        borderBottom="1px solid"
        borderColor="gray.300"
        width="100%"
      />
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        댓글
      </Text>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Box key={comment.id} mb={4} p={4} borderWidth={1} borderRadius="md">
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
                    onClick={() => handleReplyClick(comment.id)}
                  >
                    답글
                  </Button>
                </Box>
                <Text mt={2}>{comment.content}</Text>
              </Box>
            </Box>

            {replyingTo === comment.id && (
              <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
                <Textarea
                  placeholder="답글을 입력하세요."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  mb={2}
                />
                <Flex gap={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleReplySubmit(comment.id)}
                  >
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

            {comment.replies && comment.replies.length > 0 && (
              <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
                {comment.replies.map((reply) => (
                  <Box key={reply.id} mb={2}>
                    <Text fontWeight="bold" fontSize="sm">
                      {reply.author}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {reply.regAt}
                    </Text>
                    <Text mt={1}>{reply.content}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))
      ) : (
        <Text>댓글이 없습니다.</Text>
      )}
    </Box>
  );
};

export default TaskComments;
