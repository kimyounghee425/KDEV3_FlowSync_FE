// Question 글에 맞추어 만들어 놓음.
"use client";
// 외부 라이브러리
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import { uploadFileApi } from "@/src/api/RegisterArticle";
import { BaseArticleRequestData } from "@/src/types";
import FileAddSection from "@/src/components/common/FileAddSection";
import LinkAddSection from "@/src/components/common/LinkAddSection";
import DropDownInfoBottom from "@/src/components/common/DropDownInfoBottom";
import SignUpload from "@/src/components/pages/ProjectApprovalsNewPage/components/SignUpload";

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
  initialTitle?: string;
  initialContent?: any[];
  initialLinkList?: LinkListProps[];
  initialUploadedFiles?: UploadedFilesProps[];
  title: string;
  setTitle: (value: string) => void;
  handleSave: (data: T) => void;
  progressStepId?: number;
  submitButtonLabel?: string;
  children?: React.ReactNode;
}

export default function ArticleForm({
  initialTitle = "",
  initialContent = [],
  initialLinkList = [],
  initialUploadedFiles = [],
  title,
  setTitle,
  handleSave,
  progressStepId,
  submitButtonLabel = "작성",
  children,
}: ArticleFormProps<BaseArticleRequestData>) {
  const editorRef = useRef<EditorJS | null>(null);
  const [linkList, setLinkList] = useState<LinkListProps[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesProps[]>([]);
  const [uploadedFileSize, setUploadedFileSize] = useState<number[]>([]);

  const pathname = usePathname();

  useEffect(() => {
    setTitle(initialTitle);
    setLinkList(initialLinkList);
    setUploadedFiles(initialUploadedFiles);

    initializeEditor(initialContent);

    return () => {

      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();

      }
      editorRef.current = null;
  };
  }, []);

  const initializeEditor = (content: any[] = []) => {
    editorRef.current?.destroy(); // 기존 에디터 제거
    editorRef.current = null;

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
                if (!file) {
                  console.log("🚨 파일 업로드가 취소되었습니다.");
                  removeEmptyImageBlocks(); // 취소된 상태에서 빈 블록 삭제
                  return { success: 0 };
                }

                try {
                  const responseData = await uploadFileApi(file);
                  if (responseData.result !== "SUCCESS") {
                    throw new Error("파일 업로드 실패");
                  }

                  setTimeout(() => attachImageDeleteButtons(), 500); // 이미지 업로드 후 삭제 버튼 추가
                  return { success: 1, file: { url: responseData.data.url } };
                } catch (error) {
                  console.error("파일 업로드 중 오류 발생:", error);
                  removeEmptyImageBlocks(); // 업로드 실패 시 빈 블록 제거
                  return { success: 0 };
                }
              },
            },
          },
        },
      },
      placeholder: "내용을 작성하세요",
      data: {
        blocks: content.map((block) => {
          if (block.type === "image") {
            return {
              type: "image",
              data: {
                file: { url: block.data.file?.url || block.data.src },
              },
            };
          }
          if (block.type === "paragraph") {
            return {
              type: "paragraph",
              data: { text: block.data.text || block.data },
            };
          }
          return block;
        }),
      },
      onReady: async () => {
        console.log("📝 EditorJS 초기화 완료!");
        await editorRef.current?.isReady;
        attachImageDeleteButtons(); // 초기화 완료 후 버튼 추가
      },
      onChange: () => {
        setTimeout(() => attachImageDeleteButtons(), 300); // 블록 변경 시 삭제 버튼 적용
      },
    });
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

        // 기본 데이터 객체
        const requestData: Partial<BaseArticleRequestData> = {
          title: title,
          progressStepId: progressStepId,
          content: content,
          linkList: linkList,
          fileInfoList: uploadedFiles,
        };

        // progressStepId가 존재하는 경우만 추가
        if (progressStepId !== undefined) {
          requestData.progressStepId = progressStepId;
        }

        handleSave(requestData as BaseArticleRequestData);
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 중 문제가 발생했습니다.");
      }
    }
  };

  const attachImageDeleteButtons = () => {
    if (!editorRef.current) return;

    const imageBlocks = document.querySelectorAll(
      ".ce-block__content .cdx-block",
    );

    imageBlocks.forEach((block) => {
      const blockElement = block as HTMLElement;
      const imgElement = blockElement.querySelector(
        "img",
      ) as HTMLImageElement | null;

      if (imgElement && !blockElement.querySelector(".image-delete-btn")) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌ 삭제";
        deleteButton.classList.add("image-delete-btn");
        deleteButton.style.position = "absolute";
        deleteButton.style.top = "5px";
        deleteButton.style.right = "5px";
        deleteButton.style.background = "red";
        deleteButton.style.color = "white";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.padding = "4px 8px";
        deleteButton.style.borderRadius = "4px";

        deleteButton.onclick = () => {
          editorRef.current?.blocks.delete(
            editorRef.current.blocks.getCurrentBlockIndex(),
          );
          removeEmptyImageBlocks(); // 삭제 후 빈 블록 제거
        };

        blockElement.style.position = "relative";
        blockElement.appendChild(deleteButton);
      }
    });
  };

  const removeEmptyImageBlocks = () => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    editor.save().then((savedData) => {
      const blockElements = document.querySelectorAll(".ce-block"); // DOM에서 모든 블록 찾기

      blockElements.forEach((blockElement, index) => {
        const imgElement = blockElement.querySelector("img");
        const blockData = savedData.blocks[index];

        // 이미지 블록인데 URL이 없거나 로딩 상태일 경우 삭제
        if (
          !imgElement &&
          blockData.type === "image" &&
          !blockData.data?.file?.url
        ) {
          console.log("🚨 빈 이미지 블록 발견 및 DOM에서 제거");
          blockElement.remove(); // DOM에서 로딩 박스 제거
        }
      });

      // EditorJS의 데이터 상태를 동기화 (빈 블록 필터링)
      const newBlocks = savedData.blocks.filter(
        (block) => block.type !== "image" || block.data?.file?.url,
      );

      // 데이터가 변경되었으면 에디터 재초기화
      if (newBlocks.length !== savedData.blocks.length) {
        console.log("🚨 빈 이미지 블록 제거 후 EditorJS 재초기화");
        initializeEditor(newBlocks);
      }
    });
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
      </Flex>

      <Box mb={5}>
        <Flex direction={"row"} alignItems={"center"}>
          <Text>상세 내용</Text>
          <DropDownInfoBottom
            text={
              '사진 첨부가 가능합니다. \n 사진을 끌어다 놓거나 드래그하여 업로드하세요. \n 또는 "/"를 입력한 후 "IMAGE"를 선택하여 추가할 수도 있습니다.'
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
      {pathname.includes("/approvals") && (
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
        {submitButtonLabel}
      </Button>
    </Flex>
  );
}
