// 댓글 섹션의 최상위 컴포넌트

// 외부 라이브러리
import { Box, Text } from "@chakra-ui/react";
import Comments from "@/src/components/common/Comments";
import { ArticleComment } from "@/src/types";

interface ArticleCommentsProps {
    comments: ArticleComment[];
    setCommentIsWritten: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ArticleComments({ comments, setCommentIsWritten }: ArticleCommentsProps) {

  const hasVisibleComments = comments.some(
    (comment) => !comment.deleted || (comment.deleted && comments.some((reply) => reply.parentId === comment.id && !reply.deleted))
  );

  return (
    <Box>
      <Box
        my={4}
        borderBottomWidth="1px"
        borderColor="gray.300"
        width="100%"
      />
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        댓글
      </Text>
      {hasVisibleComments ? (
        <Comments comments={comments} setCommentIsWritten={setCommentIsWritten} />
      ) : (
        <Text color={"gray.500"} fontSize={"sm"}>댓글이 없습니다.</Text>
      )}
    </Box>
  );
}
