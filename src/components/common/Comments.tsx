// 댓글 목록을 렌더링하는 중간 레이어 컴포넌트

// 외부 라이브러리
import { Box, Flex, Text } from "@chakra-ui/react";

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
      {parentComments.map((comment) => {
        const replies = commentMap.get(comment.id) || [];
        const hasVisibleReplies = replies.some((reply) => !reply.deleted);

        // 삭제된 댓글이고, 답글이 없거나 모두 삭제된 경우 렌더링 안 함
        if (comment.deleted && !hasVisibleReplies) return null;

        return (
          <Box key={comment.id}>
            {comment.deleted ? (
              // 삭제된 댓글이고, 답글이 있으면 "삭제된 댓글입니다" 표시

              <Box color="gray.500" fontStyle="italic" pb={2} pt={5}>
                삭제된 댓글입니다.
              </Box>
            ) : (
              <CommentItem
                comment={comment}
                setCommentIsWritten={setCommentIsWritten}
              />
            )}

            {hasVisibleReplies && (
              <Box ml={4}>
                {replies.map((reply) =>
                  reply.deleted ? null : ( // 삭제된 대댓글은 표시하지 않음
                    <Box
                      key={reply.id}
                      display="flex"
                      alignItems="center"
                      flexDirection="row"
                    >
                      <Box
                        width="1.5rem"
                        display="flex"
                        justifyContent="center"
                      >
                        <Text
                          fontWeight={"light"}
                          fontSize={"1.9rem"}
                          pb={6}
                          pl={5}
                        >
                          ㄴ
                        </Text>
                      </Box>

                      <Box flex={"1"}>
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          setCommentIsWritten={setCommentIsWritten}
                        />
                      </Box>
                    </Box>
                  ),
                )}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
