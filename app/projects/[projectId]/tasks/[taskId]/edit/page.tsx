"use client";

import { mockData } from "../data/mockData";
import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  Text,
  VStack,
  HStack,
  Link,
} from "@chakra-ui/react";
import BackButton from "@/src/components/common/backButton";
import { useParams } from "next/navigation";

export default function Edit() {
  const { taskId } = useParams();

  const task = Object.values(mockData).find(
    (task) => task.id === Number(taskId)
  );

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [file, setFile] = useState<string>("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(task.content);
      setSummary(task.summary);
      setLink(task.link);
      setFile(task.file);
    }
  }, [task]);

  if (!task) {
    return <Text>페이지를 찾을 수 없습니다</Text>;
  }

  const handleFileDelete = () => {
    setFile("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      setFile(newFile.name);
    }
  };

  return (
    <Box>
      <BackButton />

      <Box>
        <Box mb={5}>
          <Text fontWeight="bold">제목</Text>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요."
          />
        </Box>

        <Box mb={5}>
          <Text fontWeight="bold" mb={2}>
            내용
          </Text>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요."
            height={200}
          />
        </Box>

        <Box mb={5}>
          <Text fontWeight="bold" mb={2}>
            질문 요약
          </Text>
          <Input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="요약을 입력하세요."
          />
        </Box>

        <Box mb={5}>
          <Text fontWeight="bold" mb={2}>
            링크 첨부
          </Text>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="링크(URL)를 입력하세요."
          />
        </Box>

        <Box mb={5}>
          <Text fontWeight="bold" mb={2}>
            첨부파일
          </Text>
          <VStack align="start">
            {file && (
              <HStack>
                <a>{file}</a>
                <Button onClick={handleFileDelete}>삭제</Button>
              </HStack>
            )}

            {/* 첨부파일 업로드 */}
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />
          </VStack>
        </Box>

        <Button>저장</Button>
      </Box>
    </Box>
  );
}
