// 댓글 섹션의 최상위 컴포넌트

import { Box, Text } from "@chakra-ui/react";
import Comments from "./Comments";
import { TaskCommentsProps } from "@/src/types/taskTypes";

const TaskComments = ({ comments }: TaskCommentsProps) => {
  // 삭제된 댓글을 제외한 목록 생성
  const filteredComments = comments.filter(
    (comment) =>
      comment.deletedYn === "N" ||
      comment.replies.some((reply) => reply.deletedYn === "N"),
  );

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
        <Comments comments={filteredComments} />
      ) : (
        <Text>댓글이 없습니다.</Text>
      )}
    </Box>
  );
};

export default TaskComments;
