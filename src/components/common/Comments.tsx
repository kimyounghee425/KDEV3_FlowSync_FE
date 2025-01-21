// 댓글 목록을 렌더링하는 중간 레이어 컴포넌트

// 외부 라이브러리
import { Box } from "@chakra-ui/react";

// 절대 경로 파일
import CommentItem from "@/src/components/common/CommentItem";
import { TaskCommentsProps } from "@/src/types/taskTypes";

export default function Comments({ comments }: TaskCommentsProps) {
  return (
    <Box>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
}
