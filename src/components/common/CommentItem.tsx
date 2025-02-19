// 외부 라이브러리
import { useState, useRef, useEffect } from "react";
import { Box, Button, Text, Flex, Textarea } from "@chakra-ui/react";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
// 절대 경로 파일
import { ArticleComment } from "@/src/types";
import {
  deleteQuestionComment,
  deleteApprovalComment,
  editApprovalComment,
  editQuestionComment,
} from "@/src/api/commentAPI";
import CommentBox from "@/src/components/common/CommentBox";
import { readQuestionApi, readApprovalApi } from "@/src/api/ReadArticle";
import { getMeApi } from "@/src/api/getMembersApi";
import { showToast } from "@/src/utils/showToast";

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
  const { projectId, questionId, approvalId } = useParams() as {
    projectId: string;
    questionId?: string;
    approvalId?: string;
  };
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openOptionId, setOpenOptionId] = useState<number | null>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(comment.content);
  const [myId, setMyId] = useState<number>();
  const [isDeleted, setIsDeleted] = useState<boolean>();

  const pathname = usePathname();

  const fetchMyData = async () => {
    try {
      const myData = await getMeApi();
      setMyId(myData.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyData();

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

  // 댓글 수정을 위해 댓글 내용 불러오기
  const fetchComment = async (commentId: number) => {
    try {
      if (pathname.includes("/questions") && questionId) {
        const responseData = await readQuestionApi(
          Number(projectId),
          Number(questionId),
        );
        const filteredComment = responseData.commentList.find(
          (comment: { id: number }) => comment.id === commentId,
        );
        return filteredComment?.content;
      } else if (pathname.includes("/approvals") && approvalId) {
        const responseData = await readApprovalApi(
          Number(projectId),
          Number(approvalId),
        );
        const filteredComment = responseData.commentList.find(
          (comment: { id: number }) => comment.id === commentId,
        );
        return filteredComment?.content;
      }
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
      return null;
    }
  };

  const handleEdit = async (commentId: number) => {
    const existingContent = await fetchComment(commentId);
    setEditedContent(
      typeof existingContent === "string" ? existingContent : "",
    );
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!editedContent.trim()) {
      const errorMessage = "댓글 내용을 입력하세요.";
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
      return;
    }

    const requestData = { content: editedContent };

    try {
      if (pathname.includes("/questions") && questionId) {
        const responseData = await editQuestionComment(
          Number(projectId),
          Number(questionId),
          Number(comment.id),
          requestData,
        );
      } else if (pathname.includes("/approvals") && approvalId) {
        const responseData = await editApprovalComment(
          Number(projectId),
          Number(approvalId),
          Number(comment.id),
          requestData,
        );
      }
      setIsEditing(false);
      setCommentIsWritten((prev) => !prev); // 상태 변경을 트리거해서 새로고침 효과
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      if (pathname.includes("/questions")) {
        const responseData = await deleteQuestionComment(
          Number(projectId),
          Number(questionId),
          Number(commentId),
        );
      } else if (pathname.includes("/approvals")) {
        const responseData = await deleteApprovalComment(
          Number(projectId),
          Number(approvalId),
          Number(commentId),
        );
      }
      setCommentIsWritten((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  return (
    <Box
      mt={2}
      pl={comment.parentId ? 10 : 0}
      borderColor={"gray.200"}
      py={4}
      borderBottom="1px solid #E2E8F0"
    >
      <Text fontWeight={"bold"} pb={2}>
        {`${comment.register.name} (${comment.register.jobTitle}) / ${comment.register.jobRole}`}
      </Text>

      {/* 댓글 본문 */}
      <Flex justifyContent="space-between">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            maxLength={250}
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          />
        ) : (
          <Text
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
              minWidth: "0",
            }}
          >
            {comment.content}
          </Text>
        )}
        <Box ref={dropdownRef} flexShrink={0}>
          {/* 옵션 버튼 */}
          {myId === comment.register.id ? (
            <Button
              size="xs"
              aria-label="댓글 옵션"
              bg="transparent"
              _hover={{ bg: "gray.100" }}
              onClick={() => toggleOption(comment.id)}
            >
              <Image
                src="/아이콘.png"
                alt="옵션 아이콘"
                width={16}
                height={16}
              />
            </Button>
          ) : null}
          {openOptionId === comment.id && (
            <Box
              position="absolute"
              bg="white"
              boxShadow="md"
              p={2}
              zIndex={10}
            >
              {isEditing ? (
                ""
              ) : (
                <Button
                  size="xs"
                  backgroundColor={"gray.200"}
                  _hover={{ backgroundColor: "gray.300" }}
                  mr={2}
                  onClick={() => handleEdit(comment.id)}
                >
                  수정
                </Button>
              )}
              <Button
                size="xs"
                backgroundColor={"red.300"}
                _hover={{ backgroundColor: "red.400" }}
                color={"white"}
                onClick={() => handleDelete(comment.id)}
              >
                삭제
              </Button>
            </Box>
          )}
        </Box>
      </Flex>

      {isEditing && (
        <Box>
          <Button
            mt={2}
            mr={2}
            size="xs"
            backgroundColor={"#00a8ff"}
            _hover={{ backgroundColor: "#0095ff" }}
            color={"white"}
            onClick={handleUpdate}
          >
            저장
          </Button>
          <Button
            mt={2}
            size="xs"
            backgroundColor={"gray.200"}
            _hover={{ backgroundColor: "gray.300" }}
            onClick={handleCancel}
          >
            취소
          </Button>
        </Box>
      )}

      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Flex>
          <Text color={"gray.400"} mr={3}>
            {comment.regAt}
          </Text>
          {!(comment.parentId !== null && !comment.isParent) && (
            <Button
              size={"2xs"}
              fontSize={"1rem"}
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
