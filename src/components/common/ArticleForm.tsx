// Question 글에 맞추어 만들어 놓음.
"use client";
// 외부 라이브러리
import React, { useEffect, useRef, useState } from "react";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";
import { uploadFileApi } from "@/src/api/RegisterArticle";
import { BaseArticleRequestData } from "@/src/types";
import { usePathname } from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import FileAddSection from "@/src/components/common/FileAddSection";
import LinkAddSection from "@/src/components/common/LinkAddSection";
import SignUpload from "@/src/components/pages/ApprovalRegisterPage/components/SignUpload";
import DropDownInfoBottom from "./DropDownInfoBottom";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UploadedFilesProps {
  originalName: string;
  saveName: string;
  url: string;
  size: number;
}

interface LinkListProps {
  name: string;
  url: string;
}

interface ArticleFormProps<T extends BaseArticleRequestData> {
  title: string;
  setTitle: (value: string) => void;
  handleSave: (data: T) => void;
  children?: React.ReactNode;
}

export default function ArticleForm({
  title,
  setTitle,
  handleSave,
  children,
}: ArticleFormProps<BaseArticleRequestData>) {
  const editorRef = useRef<EditorJS | null>(null);
  const [linkList, setLinkList] = useState<LinkListProps[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesProps[]>([]);
  const [uploadedFileSize, setUploadedFileSize] = useState<number[]>([]);

  const pathname = usePathname();

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
                  try {
                    const responseData = await uploadFileApi(file);
                    if (responseData.result !== "SUCCESS") {
                      console.error("파일 업로드 실패");
                      return { success: 0 };
                    }
                    return {
                      success: 1,
                      file: { url: responseData.data.url },
                    };
                  } catch (error) {
                    console.error("파일 업로드 중 오류 발생:", error);
                    return { success: 0 };
                  }
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
  const handleEditorSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        const content = savedData.blocks.map((block) => ({
          type: block.type,
          data:
            block.type === "paragraph"
              ? block.data.text
              : { src: block.data.file.url },
        }));

        if (!title.trim()) {
          window.alert("제목을 입력하세요.");
          return;
        }
        if (content.length === 0) {
          window.alert("내용을 입력하세요.");
          return;
        }

        handleSave({
          title: title,
          content: content,
          linkList: linkList,
          fileInfoList: uploadedFiles,
        });
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    // 제목 입력
    <Flex gap={4} direction={"column"}>
      {/* 카테고리 요소 */}
      {children}
      <Flex align={"center"} gap={4}>
        <Box flex={2}>
          <Text mb={2}>제목</Text>
          <Input
            placeholder="제목을 입력하세요."
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
      </Flex>

      <Box mb={5}>
        <Flex direction={"row"} alignItems={"center"}>
          <Text>상세 내용</Text>
          <DropDownInfoBottom
            text={
              "사진 첨부가 가능합니다. \n 사진을 끌어다 놓거나 ➕ 버튼을 눌러 첨부하세요."
            }
          />
        </Flex>
        <Box
          id="editorjs"
          border="1px solid #ccc"
          padding="10px"
          borderRadius="5px"
          minHeight="300px"
        />
      </Box>

      <LinkAddSection linkList={linkList} setLinkList={setLinkList} />

      {/* 파일 입력 */}
      <FileAddSection
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        uploadedFileSize={uploadedFileSize}
        setUploadedFileSize={setUploadedFileSize}
      />

      {/* 결재 글일 때만 서명 업로드 */}
      {pathname.includes("/tasks") && (
        <Box display={"flex"} justifyContent={"center"}>
          <SignUpload />
        </Box>
      )}

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
        onClick={handleEditorSave}
      >
        작성
      </Button>
    </Flex>
  );
}
