import { Box, Text, Image, Link, VStack } from "@chakra-ui/react";

const isImageFile = (file: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = file.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
};

interface ContentBlock {
  type: "text" | "image";
  data: string | { src: string };
}

interface Task {
  title: string;
  regAt: string;
  content: ContentBlock[];
  file: string[];
}

const TaskContent = ({ task }: { task: Task }) => {
  const renderContent = (content: ContentBlock[]) => {
    return content.map((block, index) => {
      if (block.type === "text" && typeof block.data === "string") {
        return (
          <Text key={index} mb={4} whiteSpace="pre-line">
            {block.data}
          </Text>
        );
      }

      if (block.type === "image" && typeof block.data === "object") {
        return (
          <Box key={index} mb={4}>
            <Image src={block.data.src} borderRadius="md" mb={2} />
          </Box>
        );
      }

      return null; // 예상치 못한 데이터 타입 처리
    });
  };

  const renderFiles = (files: any) => {
    if (!Array.isArray(files)) {
      console.error("files is not an array:", files);
      return null;
    }
  
    return files.map((file: string, index: number) => {
      return (
        <Box key={index} mb={4}>
          <Link href={file} download color="blue.500">
            {file.split("/").pop()}
          </Link>
        </Box>
      );
    });
  };

  // regAt 날짜 예쁘게 변환
  function formatDateString(dateString: string) {
    const date = new Date(task.regAt); // Date 객체 생성
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // "2025.01.08 11:34" 형태로 변환
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }

  

  return (
    <Box mb={4}>
      {/* 제목 */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {task.title}
      </Text>

      {/* 작성 일시 */}
      <Box mb={4}>
        <Text>{formatDateString(task.regAt)}</Text>
      </Box>

      {/* 본문 내용 */}
      <Box mb={4}>
        {renderContent(task.content)}
      </Box>

      {/* 첨부 파일 */}
      <Box mb={4}>
        <Text fontWeight="bold" mb={2}>
          첨부 파일:
        </Text>
        <VStack align="start">{renderFiles(task.file)}</VStack>
      </Box>
    </Box>
  );
};

export default TaskContent;






{/* 요약 */}
{/* <Box mb={4}>
  <Text fontWeight="bold">질문 요약:</Text>
  <Text>{task.summary}</Text>
</Box> */}

{/* 링크 */}
{/* <Box mb={4}>
  <Text fontWeight="bold">링크 첨부:</Text>
  <a
    href={task.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "blue" }}
  >
    {task.link}
  </a>
</Box> */}