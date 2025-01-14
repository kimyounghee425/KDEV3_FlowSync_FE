import { Box } from "@chakra-ui/react";
import CommentItem from "./CommentItem"; // 개별 댓글 컴포넌트
import { Comment as CommentType } from "@/src/types/taskTypes";

interface CommentsProps {
  comments: CommentType[];
}

const Comments = ({ comments }: CommentsProps) => {
  return (
    <Box>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
};

export default Comments;