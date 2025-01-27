// Question 글에 맞추어 만들어 놓음.

// 외부 라이브러리
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import { useParams } from "next/navigation";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";
import FileAddSection from "@/src/components/common/FileAddSection";
import ProgressStepAddSection from "@/src/components/common/ProgressStepAddSection";
import LinkAddSection from "@/src/components/common/LinkAddSection";
import axiosInstance from "@/src/api/axiosInstance";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const progressData = [
  { id: 1, title: "전체" },
  { id: 2, title: "요구사항정의" },
  { id: 3, title: "화면설계" },
  { id: 4, title: "디자인" },
  { id: 5, title: "퍼블리싱" },
  { id: 6, title: "개발" },
  { id: 7, title: "검수" },
];
interface UploadedFilesProps {
  originalName: string;
  saveName: string;
  url: string;
  size: number;
}

export default function TaskForm() {
  const { projectId } = useParams();
  const [progressStepId, setProgressStepId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const editorRef = useRef<EditorJS | null>(null);
  const [linkList, setLinkList] = useState<{ url: string; name: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesProps[]>([]);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // 서버로 파일 업로드 요청
      const response = await axiosInstance.post(`${BASE_URL}/file`, formData);

      // 서버에서 반환된 파일 URL 반환
      return response.data.url; // 서버 응답에서 URL을 반환하는 키를 확인해야 합니다
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      throw new Error("파일 업로드 중 문제가 발생했습니다.");
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
              endpoints: BASE_URL,
              field: "image",
              types: "image/*",
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

        if (!title.trim()) {
          window.alert("제목을 입력하세요.")
          return;
        }

        
        const content = savedData.blocks.map((block) => {
          if (block.type === "paragraph") {
            return {
              type: "paragrpah",
              text: block.data.text,
            };
          } else if (block.type === "image") {
            return {
              type: "image",
              data: { src: block.data.file.url },
            };
          }
          return "";
        });
        if (content.length === 0) {
          window.alert("내용을 입력하세요.")
          return;
        }

        const requestData = {
          title: title,
          content: "게시글 본문 입니다.", // TODO 이거 백엔드 수정해야 함. 1/28
          linkList: linkList,
          fileInfoList: uploadedFiles,
          progressStepId: progressStepId,
        };

        const response = await axiosInstance.post(
          `${BASE_URL}/projects/${projectId}/questions`,
          requestData,
        );
        console.log("요청데이터", requestData);
        console.log("저장성공", response.data);
        alert("저장이 완료되었습니다.");
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    // 제목 입력
    <Flex gap={4} direction={"column"}>
      <Flex align={"center"} gap={4}>
        <ProgressStepAddSection
          progressStepId={progressStepId}
          setProgressStepId={setProgressStepId}
          progressData = {progressData}
        />
        <Box flex={2}>
          <Text mb={2}>제목</Text>
          <Input
            placeholder="제목을 입력하세요."
            onChange={(e) => setTitle(e.target.value)}
          />
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

      <LinkAddSection linkList={linkList} setLinkList={setLinkList} />

      {/* 파일 입력 */}
      <FileAddSection
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />

      {/* 작성 버튼 */}
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
