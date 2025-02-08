// questionId 글 열람 페이지
"use client";

// 외부 라이브러리
import { Box, VStack, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// 절대 경로 파일
import ArticleContent from "@/src/components/common/ArticleContent";
import ArticleComments from "@/src/components/common/ArticleComments";
import CommentBox from "@/src/components/common/CommentBox";
import BackButton from "@/src/components/common/BackButton";
import { readApprovalApi } from "@/src/api/ReadArticle";
import SignToApprove from "@/src/components/pages/ProjectApprovalPage/components/SignToApprove";
import { ArticleComment, ApprovalArticle } from "@/src/types";
import DropDownMenu from "@/src/components/common/DropDownMenu";

export default function ProjectApprovalPage() {
  const { projectId, approvalId } = useParams() as {
    projectId: string;
    approvalId: string;
  };

  const [article, setArticle] = useState<ApprovalArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentList, setCommentList] = useState<ArticleComment[]>([]);
  const [commentIsWritten, setCommentIsWritten] = useState<boolean>(false);

  useEffect(() => {
    const loadApproval = async () => {
      try {
        const responseData = await readApprovalApi(
          Number(projectId),
          Number(approvalId),
        );
        setArticle(responseData);
        setCommentList(responseData.commentList ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 가져오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadApproval();
  }, [projectId, approvalId, commentIsWritten]);

  if (error) {
    return <Box>에러 발생: {error}</Box>;
  }

  if (loading) {
    return <Box>로딩 중...</Box>;
  }

  // const handleEdit = () => {
  //     router.push(`/projects/${projectId}/questions/${questionId}/edit`)
  //   }

  //   const handleDelete = async() => {
  //     const confirmDelete = window.confirm("정말로 삭제하시겠습니까?")
  //     if (!confirmDelete) return;
  //     try {
  //       await deleteQuestionApi(Number(projectId), Number(questionId))
  //       alert("게시글이 삭제되었습니다.")
  //       router.push(`/projects/${projectId}/questions`)
  //     } catch (error) {
  //       alert(`삭제 중 문제가 발생했습니다 : ${error}`)
  //     }
  //   }

  return (
    <Box
      maxW="1000px"
      w="100%"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />
      <Flex justifyContent="space-between">
        <BackButton />
        {/* <DropDownMenu onEdit={handleEdit} onDelete={handleDelete} /> */}
      </Flex>
      {/* 게시글 내용 */}

      <ArticleContent article={article} />

      {/* 결재 사인 섹션 */}
      <Flex justifyContent={"center"}>
        <SignToApprove />
      </Flex>

      {/* 댓글 섹션 */}
      <VStack align="stretch" gap={8} mt={10}>
        <ArticleComments
          comments={commentList}
          setCommentIsWritten={setCommentIsWritten}
        />
        <CommentBox setCommentIsWritten={setCommentIsWritten} />
      </VStack>
    </Box>
  );
}
