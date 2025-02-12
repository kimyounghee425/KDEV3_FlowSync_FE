// 질문 글 수정

import React, { useEffect, useState, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import { useParams, useRouter } from "next/navigation";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";
import FileAddSection from "@/src/components/common/FileAddSection";
import LinkAddSection from "@/src/components/common/LinkAddSection";
import { readApprovalApi } from "@/src/api/ReadArticle";
import { uploadFileApi } from "@/src/api/RegisterArticle";
import { editApprovalAPI } from "@/src/api/RegisterArticle";
import { ApprovalRequestData } from "@/src/types";
import EditSignUpload from "./EditSignUpload";

// 수정 api 만들고 가져와야함

// import { ApprovalArticle } from "@/src/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const progressData = [
  { id: 1, title: "요구사항정의" },
  { id: 2, title: "화면설계" },
  { id: 3, title: "디자인" },
  { id: 4, title: "퍼블리싱" },
  { id: 5, title: "개발" },
  { id: 6, title: "검수" },
];

interface UploadedFilesProps {
  originalName: string;
  saveName: string;
  url: string;
  size: number;
}

interface linkListProps {
  name: string;
  url: string;
}

export default function ApprovalEditForm() {
  const { projectId, approvalId } = useParams() as {
    projectId: string;
    approvalId: string;
  };
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const editorRef = useRef<EditorJS | null>(null);
  const [linkList, setLinkList] = useState<linkListProps[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesProps[]>([]);
  const [uploadedFileSize, setUploadedFileSize] = useState<number[]>([]);
  const [signatureUrl, setSignatureUrl] = useState<string>("");

  useEffect(() => {
    const loadTask = async () => {
      try {
        const responseData = await readApprovalApi(
          Number(projectId),
          Number(approvalId),
        );
        console.log(responseData);
        setTitle(responseData.title);
        setLinkList(responseData.linkList);
        setUploadedFiles(responseData.fileList);
        setSignatureUrl(responseData.register.signatureUrl);

        const parsedContent =
          typeof responseData.content === "string"
            ? JSON.parse(responseData.content)
            : responseData.content;

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

        setTimeout(() => {
          editorRef.current?.render({
            blocks: parsedContent.map((block: any) => {
              if (block.type === "paragraph") {
                return {
                  type: "paragraph",
                  data: { text: block.data },
                };
              } else if (block.type === "image") {
                return {
                  type: "image",
                  data: { file: { url: block.data.src } },
                };
              }
              return block;
            }),
          });
        }, 500);
      } catch (error) {
        console.log("에러발생 : ", error);
      }
    };

    loadTask();

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [projectId, approvalId]);

  const handleSave = async <T extends ApprovalRequestData>(requestData: T) => {
    try {
      const response = await editApprovalAPI(
        Number(projectId),
        Number(approvalId),
        {
          ...requestData,
          ...(requestData.progressStepId !== undefined
            ? { progressStepId: requestData.progressStepId }
            : {}),
        },
      );
      router.push(`/projects/${projectId}/approvals`);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

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

        await handleSave({
          title: title,
          content: content,
          linkList: linkList,
          fileInfoList: uploadedFiles,
        });

        // alert("수정이 완료되었습니다.");
        router.push(`/projects/${projectId}/approvals/${approvalId}`);
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    <Flex gap={4} direction={"column"}>
      <Flex gap={4} align={"center"}>
        {/* 제목 입력 */}
        <Box flex={2}>
          <Text mb={2}>제목</Text>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
      </Flex>
      <Box>
        <Text>상세 내용</Text>
        <Box
          id="editorjs"
          border="1px solid #ccc"
          padding="10px"
          borderRadius="5px"
          minHeight="300px"
        ></Box>
      </Box>
      <LinkAddSection linkList={linkList} setLinkList={setLinkList} />

      <FileAddSection
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        uploadedFileSize={uploadedFileSize}
        setUploadedFileSize={setUploadedFileSize}
      />

      {/* <EditSignUpload signatureUrl={signatureUrl} /> */}

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
        수정
      </Button>
    </Flex>
  );
}
