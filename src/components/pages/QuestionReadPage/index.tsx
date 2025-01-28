// questionId 글 열람 페이지
"use client";

// 외부 라이브러리
import { Box, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// 절대 경로 파일
import ArticleContent from "@/src/components/common/ArticleContent";
import ArticleComments from "@/src/components/common/ArticleComments";
import CommentBox from "@/src/components/common/CommentBox";
import BackButton from "@/src/components/common/BackButton";
import { readQuestionApi } from "@/src/api/ReadArticle";

import { Article } from "@/src/types";

export default function QuestionReadPage() {
  const { projectId, questionId } = useParams() as {
    projectId: string;
    questionId: string;
  };

  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await readQuestionApi(
          Number(projectId),
          Number(questionId),
        );
        setArticle(data);
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
    loadTask();
  }, [projectId, questionId]);

  if (error) {
    return <Box>에러 발생: {error}</Box>;
  }

  if (loading) {
    return <Box>로딩 중...</Box>;
  }

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

      {/* 게시글 내용 */}
      <ArticleContent article={article} />

      {/* 댓글 섹션 */}
      <VStack align="stretch" gap={8} mt={10}>
        <ArticleComments comments={article?.commentList || []} />
        <CommentBox />
      </VStack>
    </Box>
  );
}
