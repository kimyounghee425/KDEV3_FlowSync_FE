// 외부 라이브러리
import { useState, useRef, useEffect } from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
// 절대 경로 파일
import { ArticleComment } from "@/src/types";
import { deleteComment } from "@/src/api/commentAPI";
import CommentBox from "@/src/components/common/CommentBox";
import { formattedDate } from "@/src/utils/formatDateUtil";

interface CommentProps {
  comment: ArticleComment;
  replies?: ArticleComment[];
  setCommentIsWritten: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommentItem({
  comment,
  replies = [],
  setCommentIsWritten,
}: CommentProps) {
  console.log(comment.regAt)
  const { projectId, questionId } = useParams() as {
    projectId: string;
    questionId: string;
  };
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openOptionId, setOpenOptionId] = useState<number | null>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenOptionId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (id: number) => {
    setOpenOptionId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (commentId: number) => {
    // 수정 로직 추가
  };

  const handleDelete = async (commentId: number) => {
    try {
      const responseData = await deleteComment(
        Number(projectId),
        Number(questionId),
        Number(commentId),
      );
      console.log(responseData.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      mt={2}
      pl={comment.parentId ? 10 : 0}
      borderColor={"gray.200"}
      py={4}
      borderBottom="1px solid #E2E8F0"
    >
      {/* 댓글 본문 */}
      <Flex justifyContent="space-between">
        <Text>{comment.content}</Text>
        <Box ref={dropdownRef}>
          {/* 옵션 버튼 */}
          <Button
            size="xs"
            aria-label="댓글 옵션"
            bg="transparent"
            _hover={{ bg: "gray.100" }}
            onClick={() => toggleOption(comment.id)}
          >
            <Image src="/아이콘.png" alt="옵션 아이콘" width={16} height={16} />
          </Button>
          {openOptionId === comment.id && (
            <Box
              position="absolute"
              bg="white"
              boxShadow="md"
              p={2}
              zIndex={10}
            >
              <Button size="xs" onClick={() => handleEdit(comment.id)}>
                수정
              </Button>
              <Button size="xs" onClick={() => handleDelete(comment.id)}>
                삭제
              </Button>
            </Box>
          )}
        </Box>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Flex>
          <Text color={"gray.400"} mr={3}>
            {formattedDate(comment.regAt)}
          </Text>
          {!(comment.parentId !== null && !comment.isParent) && (
            <Button
              size={"2xs"}
              fontSize={15}
              bg="transparent"
              color={"gray.400"}
              onClick={() => setIsReplying((prev) => !prev)}
              _hover={{ bg: "gray.100" }}
            >
              답글 쓰기
            </Button>
          )}
        </Flex>
      </Flex>

      {isReplying && (
        <Box>
          <CommentBox
            parentId={comment.id}
            setIsReplying={setIsReplying}
            setCommentIsWritten={setCommentIsWritten}
          />
        </Box>
      )}

      {/* 대댓글 */}
      {replies.length > 0 && (
        <Box mt={2}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              setCommentIsWritten={setCommentIsWritten}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
