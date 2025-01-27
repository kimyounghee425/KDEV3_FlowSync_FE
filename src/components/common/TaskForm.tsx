// 외부 라이브러리
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";

// 절대 경로 파일
import axiosInstance from "@/src/api/axiosInstance";
import { formatDateWithTime } from "@/src/utils/formatDateUtil";

// API 엔드포인트 상수로 분리
const API_ENDPOINTS = {
  uploadFile: process.env.NEXT_PUBLIC_UPLOAD_FILE_ENDPOINT,
  fetchUrl: process.env.NEXT_PUBLIC_FETCH_URL_ENDPOINT,
};

// API 헤더 상수로 분리
const AUTH_HEADER = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
};

export default function TaskForm({
  author,
  createdDate,
}: {
  author: string;
  createdDate: string;
}) {
  const editorRef = useRef<EditorJS | null>(null);

  const [files, setFiles] = useState<(File | null)[]>([]);
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState<{ url: string; name: string }[]>([]);
  const [boardCategory, setBoardCategory] = useState<string>("");
  const [newLink, setNewLink] = useState("");
  const [newLinkName, setNewLinkName] = useState("");

  // 링크 추가
  const handleAddLink = () => {
    if (newLink && newLinkName) {
      setLinks([...links, { url: newLink, name: newLinkName }]);
      setNewLink("");
      setNewLinkName("");
    }
  };

  // 링크 제거
  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  // 새 파일 추가
  const handleAddFile = () => {
    setFiles([...files, null]);
  };

  // 특정 파일 제거
  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const uploadFile = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    try {
      const formData = new FormData();
      formData.append("fileList", file);

      const response = await axiosInstance.post("/upload", formData);
      return response.data.url || previewUrl; // 서버 응답 URL 또는 미리보기 URL
    } catch (error) {
      console.error("File upload failed:", error);
      return previewUrl; // 실패 시 미리보기 URL 유지
    }
  };

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        tools: {
          image: {
            class: ImageTool,
            config: {
              endpoints: API_ENDPOINTS,
              field: "image",
              types: "image/*",
              additionalRequestHeaders: AUTH_HEADER,
              uploader: {
                async uploadByFile(file: File) {
                  const url = await uploadFile(file);
                  return {
                    success: 1,
                    file: { url },
                  };
                },
              },
            },
          },
        },
        placeholder: "내용을 작성하세요",
      });
    }
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  // 서버에 저장하는 핸들러
  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();

        const requestData = {
          content: {
            title,
            content: savedData.blocks.map((block) => {
              if (block.type === "paragraph") {
                return {
                  type: "paragraph",
                  text: block.data.text,
                };
              } else if (block.type === "image") {
                return {
                  type: "image",
                  data: { src: block.data.file.url },
                };
              }
            }),
            boardCategory,
            boardStatus: "PROGRESS",
            taskBoardLinkList: links.map((link, index) => ({
              id: index,
              name: link.name,
              url: link.url,
            })),
          },
        };

        await axiosInstance.post("/posts", requestData);

        alert("저장이 완료되었습니다.");
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 중 문제가 발생했습니다.");
      }
    }
  };

  // 파일 저장하는 핸들러 따로 만들기
  // 파일 업로드 핸들러
  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("fileList", file);
      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedUrl = response.data.url;
      console.log(file);
      console.log([...formData.entries()]);
      alert(`파일 업로드 성공: ${uploadedUrl}`);
      return uploadedUrl; // 서버에서 반환된 URL
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드 중 문제가 발생했습니다.");
      return null;
    }
  };

  // 파일 변경 핸들러
  const handleFileChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const uploadedUrl = await handleFileUpload(file);
      if (uploadedUrl) {
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);
      }
    }
  };

  return (
    <Flex gap={4} direction={"column"}>
      <Flex align={"center"} gap={4}>
        <Box>
          <Text mb={2}>카테고리</Text>
          <Select
            value={boardCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setBoardCategory(e.target.value)
            }
            placeholder="카테고리 선택"
            bg={"white"}
            border={"1px solid #ccc"}
            borderRadius={"md"}
            height={"40px"}
            fontSize={"md"}
            paddingX={2}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px blue.500",
            }}
            _hover={{
              borderColor: "gray.500",
            }}
          >
            <option value="QUESTION">질문</option>
            <option value="REQUEST">요청</option>
            <option value="ANSWER">답변</option>
          </Select>
        </Box>
        <Box flex={2}>
          <Text mb={2}>제목</Text>
          <Input
            placeholder="제목을 입력하세요."
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
      </Flex>

      <Flex align={"center"} gap={4} width={"100%"}>
        <Box flex={"1"}>
          {/* 작성자 */}
          <Text mb={2}>작성자</Text>
          <Input type="text" value={author} readOnly />
        </Box>
        <Box flex={"1"}>
          {/* 작성 일시 */}
          <Text mb={2}>작성 일시</Text>
          <Input type="date" value={formatDateWithTime(createdDate)} readOnly />
        </Box>
      </Flex>

      <Box mb={5}>
        <Text mb={2}>상세 내용</Text>
        <Box
          id="editorjs"
          border="1px solid #ccc"
          padding="10px"
          borderRadius="5px"
          minHeight="300px"
        ></Box>
      </Box>

      <Box mt={6}>
        <Text>링크 입력</Text>
        {links.map((link, index) => (
          <Flex key={index} align="center" mb={2}>
            <Text>
              {link.name} ({link.url})
            </Text>
            <Button
              ml={4}
              colorScheme="red"
              size="sm"
              onClick={() => handleRemoveLink(index)}
            >
              제거
            </Button>
          </Flex>
        ))}
        <Flex gap={2} mt={4}>
          <Input
            placeholder="링크(URL)를 입력하세요"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <Input
            placeholder="링크 이름(별명)을 입력하세요"
            value={newLinkName}
            onChange={(e) => setNewLinkName(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleAddLink}>
            추가
          </Button>
        </Flex>
      </Box>

      <Box mt={6}>
        <Text fontWeight="bold" mb={2}>
          첨부 파일
        </Text>
        {files.map((file, index) => (
          <Box key={index} display="flex" alignItems="center" mb={4}>
            <Input type="file" onChange={(e) => handleFileChange(index, e)} />
            <Button
              ml={2}
              colorScheme="red"
              onClick={() => handleRemoveFile(index)}
            >
              제거
            </Button>
          </Box>
        ))}
        <Button colorScheme="blue" onClick={handleAddFile}>
          파일 추가
        </Button>
      </Box>

      <Button
        bg={"red.500"}
        colorScheme={"red"}
        width={"auto"}
        px={6}
        py={4}
        borderRadius={"full"}
        fontSize={"lg"}
        fontWeight={"bold"}
        boxShadow={"md"}
        _hover={{ bg: "red.600" }}
        onClick={handleSave}
      >
        작성
      </Button>
    </Flex>
  );
}
