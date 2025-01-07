import { Box, Text, Image, Link } from "@chakra-ui/react";

const isImageFile = (file: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = file.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
};

interface Task {
  title: string;
  author: string;
  createdDate: string;
  content: string;
  summary: string;
  link: string;
  file: string;
}

const TaskContent = ({ task }: { task: Task }) => {
  return (
    <Box mb={4}>
      {/* 제목 */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {task.title}
      </Text>

      {/* 작성자와 작성일시 */}
      <Box mb={4}>
        <Text>작성자: {task.author}</Text>
        <Text>{task.createdDate}</Text>
      </Box>

      {/* 내용 */}
      <Box mb={4}>
        <Text whiteSpace="pre-line">{task.content}</Text>
      </Box>

      {/* 요약 */}
      <Box mb={4}>
        <Text fontWeight="bold">질문 요약:</Text>
        <Text>{task.summary}</Text>
      </Box>

      {/* 링크 */}
      <Box mb={4}>
        <Text fontWeight="bold">링크 첨부:</Text>
        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue" }}
        >
          {task.link}
        </a>
      </Box>

      {/* 첨부 파일 */}
      <Box mb={4}>
        <Text fontWeight="bold" mb={2}>
          첨부 파일:
        </Text>
        <Link href={task.file} download color="blue.500">
          {task.file.split("/").pop()} {/* 파일 이름만 표시 */}
        </Link>
        {isImageFile(task.file) && (
          <Box mt={4}>
            <Text fontWeight="bold" mb={2}>
              이미지 미리보기:
            </Text>
            <Image src={task.file} alt="첨부 이미지" borderRadius="md" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TaskContent;