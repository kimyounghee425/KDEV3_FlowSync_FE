// 외부 라이브러리
import { Box, Text, Image, VStack, Separator } from "@chakra-ui/react";

// 절대 경로 파일
import { ArticleFile, ContentBlock, NoticeArticle } from "@/src/types";

interface ArticleContentProps<T extends NoticeArticle> {
  article: T | null;
}

export default function ArticleContent<T extends NoticeArticle>({
  article,
}: ArticleContentProps<T>) {
  if (!article) {
    return (
      <Box>
        <Text>게시물을 불러올 수 없습니다</Text>
      </Box>
    );
  }

  const parsedContent =
    typeof article.content === "string"
      ? JSON.parse(article.content)
      : article.content;

  const isDeleted =
    ("deletedYN" in article && article.deletedYN === "Y") ||
    ("isDeleted" in article && article.isDeleted === "Y"); // 삭제 여부 확인

  const renderContent = (content: ContentBlock[]) => {
    return content.map((block, index) => {
      // paragraph 데이터
      if (block.type === "paragraph" && typeof block.data === "string") {
        return (
          <Text key={index} mb={4} whiteSpace="pre-line">
            {block.data.replace(/<br\s*\/?>/g, "\n").replace(/&nbsp;/g, "").trimEnd()}
          </Text>
        );
      }
      // image 데이터
      if (block.type === "image" && typeof block.data === "object") {
        return (
          <Box key={index} mb={4}>
            <Image
              src={block.data.src}
              alt="대체 텍스트"
              borderRadius="md"
              mb={2}
            />
          </Box>
        );
      }
      return null;
    });
  };

  // 첨부파일 렌더링
  const renderFiles = (files: ArticleFile[]) => {
    if (!files || files.length === 0) {
      return <Text color="gray.500">첨부된 파일이 없습니다.</Text>;
    }
    return files.map((file, index) => {
      const fileName = file.originalName;
      return (
        <Box key={index} mb={4}>
          <a
            href={file.url}
            target="_blank"
            download={fileName}
            style={{
              color: "blue",
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: "normal",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            {fileName}
          </a>
        </Box>
      );
    });
  };

  return (
    <Box
      mb={4}
      style={{
        opacity: isDeleted ? 0.5 : 1, // 삭제된 경우 흐리게 표시 (선택 사항)
      }}
    >
      {/* 제목 */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {article.title}
      </Text>

      <Box mb={5}>
        <Text>{article.regAt}</Text>
      </Box>
      <Separator mb={5} size={"sm"} />
      {/* 본문 내용 */}
      <Box mb={4}>{renderContent(parsedContent)}</Box>
      <Separator mb={5} size={"sm"} />
      {/* 첨부 파일 */}
      <Box>
        <Text fontWeight="bold" mb={2}>
          첨부 파일
        </Text>
        <VStack align="start">{renderFiles(article.fileInfoList)}</VStack>
      </Box>
    </Box>
  );
}
