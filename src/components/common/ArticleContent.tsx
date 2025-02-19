
// 외부 라이브러리
import {
  Box,
  Text,
  Image,
  VStack,
  Separator,
  Flex,
  Button,
} from "@chakra-ui/react";

// 절대 경로 파일
import {
  QuestionArticle,
  ApprovalArticle,
  ArticleLink,
  ArticleFile,
  ContentBlock,
} from "@/src/types";
import { resolveQuestion } from "@/src/api/ReadArticle";
import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { getMeApi } from "@/src/api/getMembersApi";

interface ArticleContentProps<T extends QuestionArticle | ApprovalArticle> {
  article: T | null;
  registerId?: number;
}

export default function ArticleContent<
  T extends QuestionArticle | ApprovalArticle,
>({ article, registerId }: ArticleContentProps<T>) {
  const pathname = usePathname();
  const [articleStatus, setArticleStatus] = useState<string>("");
  const [statusColor, setStatusColor] = useState<string>("");
  const [resolved, setResolved] = useState<boolean>(false);
  const [myId, setMyId] = useState<number>();
  const { projectId, questionId } = useParams() as {
    projectId: string;
    questionId?: string;
  };

  useEffect(() => {
    getStatus();
    fetchMyData();
  }, [resolved]);

  if (!article) {
    return (
      <Box>
        <Text>게시물을 불러올 수 없습니다</Text>
      </Box>
    );
  }

  const fetchMyData = async () => {
    try {
      const myData = await getMeApi();
      setMyId(myData.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatus = () => {
    if (pathname.includes("/approvals")) {
      if (article.status === "WAIT") {
        setArticleStatus("대기");
        setStatusColor("#7E6551");
      } else if (article.status == "REJECTED") {
        setArticleStatus("반려");
        setStatusColor("red.400");
      } else {
        setArticleStatus("승인");
        setStatusColor("#00A8FF");
      }
    } else if (pathname.includes("/questions")) {
      if (article.status === "WAIT") {
        setArticleStatus("답변 대기");
        setStatusColor("#7E6551");
      } else {
        setArticleStatus("답변 완료");
        setStatusColor("#00A8FF");
      }
    }
  };

  const parsedContent =
    typeof article.content === "string"
      ? JSON.parse(article.content)
      : article.content;

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

  // 링크 렌더링
  const renderLinks = (links: ArticleLink[]) => {
    return links.map((link, index) => {
      const url =
        link.url.startsWith("http://") || link.url.startsWith("https://")
          ? link.url
          : `https://${link.url}`;

      return (
        <Box
          key={index}
          mb={2}
          cursor="pointer"
          color={"blue"}
          onClick={() => window.open(url, "_blank")}
          _hover={{ textDecoration: "underline" }}
        >
          <Text fontWeight="normal">{link.name}</Text>
        </Box>
      );
    });
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

  const handleResolve = async (projectId: number, questionId?: number) => {
    try {
      if (questionId) {
        const responseData = await resolveQuestion(projectId, questionId);

        setResolved(true);
        article.status = "RESOLVED";
      }
    } catch (error) {
      console.error("답변 완료 요청 실패 : ", error);
    }
  };

  return (
    <Box mb={4}>
      {/* 제목 */}

      <Flex direction={"row"} pb={4} pt={3}>
        <Button
          fontSize="md"
          fontWeight="bold"
          backgroundColor={statusColor}
          borderRadius="xl"
          color={"white"}
          mr={4}
          height={"2.2rem"}
          width={"5rem"}
        >
          {articleStatus}
        </Button>
        <Text fontSize="2xl" fontWeight="bold">
          {article.title}
        </Text>
      </Flex>

      {/* 작성자, 작성 일시 (NoticeArticle인 경우 작성자 정보 숨김) */}

      <Flex mb={4} justifyContent={"space-between"}>
        <Box>
          <Text pb={2} fontWeight={"bold"}>
            {`작성자 : ${article.register.name} (${article.register.jobTitle}) / ${article.register.jobRole}`}
          </Text>
          <Text color={"gray.400"}>
            등록일: {article.regAt}
          </Text>
        </Box>
        {pathname.includes("/questions") && myId === registerId ? (
          <Button
            color={"white"}
            backgroundColor={"#00a8ff"}
            _hover={{ backgroundColor: "#0095ff" }}
            onClick={() =>
              handleResolve(
                Number(projectId),
                questionId ? Number(questionId) : undefined,
              )
            }
          >
            질문 해결
          </Button>
        ) : null}
      </Flex>

      <Separator mb={6} size={"lg"} />

      {/* 본문 내용 */}
      <Box mb={4}>{renderContent(parsedContent)}</Box>
      <br />
      <br />
      {/* 첨부 링크 */}
      <Box>
        {article.linkList.length !== 0 ? (
          <Box>
            <Separator mb={6} />
            <Text fontWeight="bold" mb={2}>
              첨부 링크
              <VStack align="start">{renderLinks(article.linkList)}</VStack>
            </Text>
            <br />
            <br />
          </Box>
        ) : null}
      </Box>
      {/* 첨부 파일 */}
      <Box mb={4}>
        {article.fileList.length !== 0 ? (
          <Box>
            <Separator mb={6} />
            <Text fontWeight="bold" mb={2}>
              첨부 파일
            </Text>
            <VStack align="start">{renderFiles(article.fileList)}</VStack>

            <Separator mb={6} size={"lg"} />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
