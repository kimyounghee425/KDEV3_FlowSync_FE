// Question 글에 맞추어 만들어 놓음.
"use client";
// 외부 라이브러리
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import { uploadContentFileApi } from "@/src/api/RegisterArticle";
import { BaseArticleRequestData } from "@/src/types";
import FileAddSection from "@/src/components/common/FileAddSection";
import LinkAddSection from "@/src/components/common/LinkAddSection";
import DropDownInfoBottom from "@/src/components/common/DropDownInfoBottom";
import SignUpload from "@/src/components/pages/ProjectApprovalsNewPage/components/SignUpload";
import { showToast } from "@/src/utils/showToast";
import { isToday } from "date-fns";


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
  const [isSignYes, setIsSignYes] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [contentText, setContentText] = useState("");
  const maxContentLength = 10000;
  const pathname = usePathname();

  useEffect(() => {
    const disableUndo = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "z") {
        event.preventDefault(); // 기본 동작 차단
      }
    };

    document.addEventListener("keydown", disableUndo);
    return () => {
      document.removeEventListener("keydown", disableUndo);
    };
  }, []);

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
                  removeEmptyImageBlocks(); // 취소된 상태에서 빈 블록 삭제
                  return { success: 0 };
                }

                try {
                  const responseData = await uploadContentFileApi(file);
                  if (responseData.result !== "SUCCESS") {
                    throw new Error("파일 업로드 실패");
                  }

                  setTimeout(() => attachImageDeleteButtons(), 500); // 이미지 업로드 후 삭제 버튼 추가
                  return { success: 1, file: { url: responseData.data.url } };
                } catch (error: any) {
                  console.error("파일 업로드 중 오류 발생:", error);
                  // alert("이미지 파일 크기는 10mb 를 초과할 수 없습니다.");
                  const errorMessage =
                    "이미지 크기는 10MB 를 초과할 수 없습니다.";
                  showToast({
                    title: "요청 실패",
                    description: errorMessage,
                    type: "error",
                    duration: 3000,
                    error: errorMessage,
                  });
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
        await editorRef.current?.isReady;
        attachImageDeleteButtons(); // 초기화 완료 후 버튼 추가
      },
      onChange: async () => {
        setTimeout(() => attachImageDeleteButtons(), 300); // 블록 변경 시 삭제 버튼 적용

        const savedData = await editorRef.current?.save();

        let totalText = "";
        savedData?.blocks.forEach((block) => {
          if (block.type === "paragraph") {
            totalText += block.data.text || "";
          } else if (block.type === "image" && block.data?.file?.url) {
            totalText += block.data.file.url; // 이미지 URL 길이 포함
          }
        });
        setContentText(totalText.slice(0, maxContentLength));
      },
    });
  };

  const handleEditorSave = useCallback(
    debounce(async () => {
      if (isSaving) return;

      setIsSaving(true);
      try {
        if (!editorRef.current) return;
        const savedData = await editorRef.current.save();

        const content = savedData.blocks.map((block) => ({
          type: block.type,
          data:
            block.type === "paragraph"
              ? block.data.text
              : { src: block.data.file.url },
        }));

        if (!title.trim()) {
          alert("제목을 입력하세요.");
          return;
        }
        if (content.length === 0) {
          alert("내용을 입력하세요.");
          return;
        }
        if (pathname.includes("/approvals") && !isSignYes) {
          alert("서명을 입력하세요");
          return;
        }

        const requestData: Partial<BaseArticleRequestData> = {
          title,
          progressStepId,
          content,
          linkList,
          fileInfoList: uploadedFiles,
        };

        if (progressStepId !== undefined) {
          requestData.progressStepId = progressStepId;
        }
        await handleSave(requestData as BaseArticleRequestData);
      } catch (error) {
        console.error("저장 실패:", error);
        return;
      } finally {
        setIsSaving(false);
      }
    }, 1000), // ✅ 1초 동안 연속 클릭 방지
    [title, linkList, uploadedFiles, isSignYes, handleSave, progressStepId],
  );

  const attachImageDeleteButtons = () => {
    if (!editorRef.current) return;

    const blocks = document.querySelectorAll(".ce-block__content .cdx-block");

    blocks.forEach((block) => {
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
          if (!editorRef.current) return;

          // ✅ 현재 클릭한 블록을 기준으로 EditorJS의 블록 인덱스 찾기
          const blockIndex = editorRef.current.blocks.getCurrentBlockIndex();

          if (blockIndex !== -1) {
            editorRef.current.blocks.delete(blockIndex);
          } else {
            return;
          }
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
        editor.blocks.delete(index);
        // 이미지 블록인데 URL이 없거나 로딩 상태일 경우 삭제
        if (
          !imgElement &&
          blockData.type === "image" &&
          !blockData.data?.file?.url
        ) {
          blockElement.remove(); // DOM에서 로딩 박스 제거
        }
      });

      // EditorJS의 데이터 상태를 동기화 (빈 블록 필터링)
      const newBlocks = savedData.blocks.filter(
        (block) => block.type !== "image" || block.data?.file?.url,
      );
    

      // 데이터가 변경되었으면 에디터 재초기화
      if (newBlocks.length !== savedData.blocks.length) {
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
          <Flex direction={"row"} alignItems={"center"}>
            <Text pb={2}>제목</Text>
            <Text pb={2} pl={2}>
              {title.length} / 80{" "}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxHeight={"200px"}
            maxLength={80}
            style={{
              overflow: "hidden",
              resize: "none", // 크기 조절 방지
              minHeight: "40px", // 최소 높이
              height: "40px", // 기본 높이
            }}
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
          <Text>
            {contentText.length} / {maxContentLength}{" "}
          </Text>
        </Flex>
        <Box
          id="editorjs"
          border="1px solid #ccc"
          padding="10px"
          borderRadius="5px"
          minHeight="300px"
        />
      </Box>

      {!pathname.includes("/notices") && (
        <LinkAddSection linkList={linkList} setLinkList={setLinkList} />
      )}

      {/* 파일 입력 */}
      <FileAddSection
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        uploadedFileSize={uploadedFileSize}
        setUploadedFileSize={setUploadedFileSize}
      />

      {/* 결재 글일 때만 서명 업로드 */}
      {pathname.includes("/approvals") && (
        <Box>
          <Box display={"flex"} direction={"row"} alignItems={"center"}>
            <Text pr={2}>서명</Text>
            <DropDownInfoBottom
              text={`결재 글은 서명을 기입해야 작성이 가능합니다. \n "서명 불러오기" 는 기존에 저장된 서명을 불러옵니다. \n 새 서명을 기입하고 "등록" 을 누르면 기존에 저장되어 있던 서명은 삭제됩니다. `}
            />
          </Box>
          <Box display={"flex"} justifyContent={"center"}>
            <SignUpload setIsSignYes={setIsSignYes} />
          </Box>
        </Box>
      )}

      {/* 작성 버튼 */}
      <Button
        bg={"blue.300"}
        color={"white"}
        width={"auto"}
        px={6}
        py={4}
        borderRadius={"full"}
        fontSize={"lg"}
        fontWeight={"bold"}
        boxShadow={"md"}
        onClick={handleEditorSave}
        disabled={isSaving}
        _hover={{ bg: "red.600" }}
        loading={isSaving}
        loadingText={`${submitButtonLabel} 중...`}
      >
        {submitButtonLabel}
      </Button>
    </Flex>
  );
}
