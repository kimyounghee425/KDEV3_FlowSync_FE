// // 댓글 목록을 렌더링하는 중간 레이어 컴포넌트

// // 외부 라이브러리
// import { Box } from "@chakra-ui/react";

// // 절대 경로 파일
// import CommentItem from "@/src/components/common/CommentItem";
// import { ArticleCommentsProps } from "@/src/types";

// export default function Comments({ comments }: ArticleCommentsProps) {
//   return (
//     <Box>
//       {comments.map((comment) => (
//         <CommentItem key={comment.id} comment={comment} />
//       ))}
//     </Box>
//   );
// }
// 댓글 목록을 렌더링하는 중간 레이어 컴포넌트

// 외부 라이브러리
import { Box } from "@chakra-ui/react";

// 절대 경로 파일
import CommentItem from "@/src/components/common/CommentItem";
import { ArticleComment } from "@/src/types";

interface ArticleCommentsProps {
  comments: ArticleComment[];
  setCommentIsWritten: React.Dispatch<React.SetStateAction<boolean>>;
}

// 댓글 계층구조로 정리 함수
const groupCommentsByParent = ({
  comments,
  setCommentIsWritten,
}: ArticleCommentsProps) => {
  const commentMap = new Map<number, ArticleComment[]>();

  // 원 댓글 필터링
  const parentComments = comments
    .filter((comment) => comment.isParent && comment.parentId === null)
    .sort((a, b) => new Date(a.regAt).getTime() - new Date(b.regAt).getTime());

  // 대댓 원 댓글 기준으로 그룹핑
  comments.forEach((comment) => {
    if (!comment.isParent && comment.parentId !== null) {
      if (!commentMap.has(comment.parentId)) {
        commentMap.set(comment.parentId, []);
      }
      commentMap.get(comment.parentId)!.push(comment);
    }
  });

  // 대댓 시간순 정렬
  commentMap.forEach((replies) => {
    replies.sort(
      (a, b) => new Date(a.regAt).getTime() - new Date(b.regAt).getTime(),
    );
  });
  return { parentComments, commentMap };
};

export default function Comments({
  comments,
  setCommentIsWritten,
}: ArticleCommentsProps) {
  const { parentComments, commentMap } = groupCommentsByParent({
    comments,
    setCommentIsWritten,
  });

  return (
    <Box>
      {parentComments.map((comment) => (
        <Box key={comment.id}>
          <CommentItem
            comment={comment}
            setCommentIsWritten={setCommentIsWritten}
          />
          {commentMap.has(comment.id) && (
            <Box>
              {commentMap.get(comment.id)!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  setCommentIsWritten={setCommentIsWritten}
                />
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
