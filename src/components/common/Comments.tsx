// 댓글 목록을 렌더링하는 중간 레이어 컴포넌트

import { Box } from "@chakra-ui/react";
import CommentItem from "./CommentItem";
import { TaskCommentsProps } from "@/src/types/taskTypes";

const Comments = ({ comments }: TaskCommentsProps) => {
  return (
    <Box>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
};

export default Comments;
