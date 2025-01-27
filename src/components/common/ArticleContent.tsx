// 외부 라이브러리
import { Box, Text, Image, VStack } from "@chakra-ui/react";

// 절대 경로 파일
import { Article, ArticleLink, ArticleFile, ContentBlock } from "@/src/types";
import { formatDateWithTime } from "@/src/utils/formatDateUtil";

interface ArticleContentProps {
  article: Article | null;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  if (!article) {
    return (
      <Box>
        <Text>게시물을 불러올 수 없습니다</Text>
      </Box>
    );
  }

  // 임시용
  const fakeRenderContent = (content: string) => {
    return (
      <Text mb={4} whiteSpace="pre-line">
        {content}
      </Text>
    );
  };

  // 이게 진짜임
  const renderContent = (content: ContentBlock[]) => {
    return content.map((block, index) => {
      // paragraph 데이터
      if (block.type === "paragraph" && typeof block.data === "string") {
        return (
          <Text key={index} mb={4} whiteSpace="pre-line">
            {block.data}
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

  // 링크 렌더링
  const renderLinks = (links: Article["linkList"]) => {
    return links.map((link: ArticleLink, index: number) => (
      <Box
        key={index}
        mb={2}
        cursor="pointer"
        color={"blue"}
        onClick={() => window.open(link.url, "_blank")}
        _hover={{ textDecoration: "underline" }}
      >
        <Text fontWeight="normal">{link.name}</Text>
      </Box>
    ));
  };

  // 첨부파일 렌더링
  const renderFiles = (files: ArticleFile[]) => {
    return files.map((file, index) => {
      const fileName = file.originalName;
      return (
        <Box key={index} mb={4}>
          <a
            href={file.url}
            target="blank"
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

  // regAt 날짜 예쁘게 변환

  return (
    <Box mb={4}>
      {/* 제목 */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {article.title}
      </Text>

      {/* 작성자, 작성 일시 */}
      <Box mb={4}>
        <Text>작성자: {article.author}</Text>
        <Text>{formatDateWithTime(article.regAt)}</Text>
      </Box>

      {/* 본문 내용 */}
      <Box mb={4}>{fakeRenderContent(article.content)}</Box>
      <br />
      <br />
      {/* 첨부 링크 */}
      <Box>
        <Text fontWeight="bold" mb={2}>
          첨부 링크
          <VStack align="start">{renderLinks(article.linkList)}</VStack>
        </Text>
      </Box>
      <br />
      <br />
      {/* 첨부 파일 */}
      <Box mb={4}>
        <Text fontWeight="bold" mb={2}>
          첨부 파일
        </Text>
        <VStack align="start">{renderFiles(article.fileList)}</VStack>
      </Box>
    </Box>
  );
}
