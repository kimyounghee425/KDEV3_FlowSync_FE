// 질문 글 수정

import { debounce } from "lodash";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";
import FileAddSection from "@/src/components/common/FileAddSection";
import LinkAddSection from "@/src/components/common/LinkAddSection";
import { readQuestionApi } from "@/src/api/ReadArticle";
import { uploadFileApi } from "@/src/api/RegisterArticle";
import { editQuestionAPI } from "@/src/api/RegisterArticle";
import { QuestionRequestData } from "@/src/types";
import { showToast } from "@/src/utils/showToast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export default function QuestionEditForm() {
  const { projectId, questionId } = useParams() as {
    projectId: string;
    questionId: string;
  };
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const editorRef = useRef<EditorJS | null>(null);
  const [linkList, setLinkList] = useState<linkListProps[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesProps[]>([]);
  const [uploadedFileSize, setUploadedFileSize] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const handleShiftEnterAsEnter = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "Enter") {
        event.preventDefault(); // 기본 `<br>` 개행 방지

        if (editorRef.current) {
          const editor = editorRef.current;
          const currentBlock = editor.blocks.getCurrentBlockIndex();

          if (currentBlock !== -1) {
            editor.blocks.insert(
              "paragraph",
              { text: "" },
              undefined,
              currentBlock + 1,
              true,
            );

            // 커서를 새 블록으로 자동 이동
            setTimeout(() => {
              editor.caret.setToBlock(currentBlock + 1, "start");
            }, 10);
          }
        }
      }
    };

    document.addEventListener("keydown", handleShiftEnterAsEnter);
    return () => {
      document.removeEventListener("keydown", handleShiftEnterAsEnter);
    };
  }, []);

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
    const loadTask = async () => {
      try {
        const responseData = await readQuestionApi(
          Number(projectId),
          Number(questionId),
        );
        setTitle(responseData.title);
        setLinkList(responseData.linkList);
        setUploadedFiles(responseData.fileList);

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
                          const errorMessage = "이미지 업로드 중 오류 발생";
                          showToast({
                            title: "요청 실패",
                            description: errorMessage,
                            type: "error",
                            duration: 3000,
                            error: errorMessage,
                          });
                          const blockIndex =
                            editorRef.current?.blocks.getCurrentBlockIndex();
                          if (blockIndex !== undefined && blockIndex !== -1) {
                            editorRef.current?.blocks.delete(blockIndex);
                          }
                          return { success: 0 };
                        }

                        setTimeout(() => {
                          attachImageDeleteButtons();
                        }, 500);

                        return {
                          success: 1,
                          file: { url: responseData.data.url },
                        };
                      } catch (error) {
                        const blockIndex =
                          editorRef.current?.blocks.getCurrentBlockIndex();
                        if (blockIndex !== undefined && blockIndex !== -1) {
                          editorRef.current?.blocks.delete(blockIndex);
                        }
                        const errorMessage =
                          "이미지 크기는 10MB 를 초과할 수 없습니다.";
                        showToast({
                          title: "요청 실패",
                          description: errorMessage,
                          type: "error",
                          duration: 3000,
                          error: errorMessage,
                        });
                        return { success: 0 };
                      }
                    },
                  },
                },
              },
            },
            placeholder: "내용을 작성하세요",
            onReady: async () => {
              await editorRef.current?.isReady;
              attachImageDeleteButtons();
            },
            onChange: () => {
              setTimeout(() => attachImageDeleteButtons(), 300); // 블록 변경 시 삭제 버튼 적용
            },
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
        console.error("에러발생 : ", error);
      }
    };

    loadTask();

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [projectId, questionId]);

  const handleSave = async <T extends QuestionRequestData>(requestData: T) => {
    try {
      const response = await editQuestionAPI(
        Number(projectId),
        Number(questionId),
        {
          ...requestData,
          ...(requestData.progressStepId !== undefined
            ? { progressStepId: requestData.progressStepId }
            : {}),
        },
      );
      if (response.message) {
        showToast({
          title: "요청 성공",
          description: response.message,
          type: "success",
          duration: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "질문 등록 중 중 오류가 발생했습니다.";

      // ✅ 토스트로 사용자에게 알림
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
      alert("저장 중 문제가 발생했습니다.");
    }
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

        await handleSave({
          title,
          content,
          linkList,
          fileInfoList: uploadedFiles,
        });

        router.push(`/projects/${projectId}/questions/${questionId}`);
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 중 문제가 발생했습니다.");
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [title, linkList, uploadedFiles, handleSave],
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

  return (
    <Flex gap={4} direction={"column"}>
      <Flex gap={4} align={"center"}>
        {/* 제목 입력 */}
        <Box flex={2}>
          <Text mb={2}>제목</Text>
          <Input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
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

      <Button
        bg={"#00a8ff"}
        colorScheme={"red"}
        loading={isSaving}
        loadingText="저장 중..."
        width={"auto"}
        px={6}
        py={4}
        borderRadius={"full"}
        fontSize={"lg"}
        fontWeight={"bold"}
        boxShadow={"md"}
        _hover={{ bg: "#0095ff" }}
        onClick={handleEditorSave}
        disabled={isSaving}
      >
        수정
      </Button>
    </Flex>
  );
}
