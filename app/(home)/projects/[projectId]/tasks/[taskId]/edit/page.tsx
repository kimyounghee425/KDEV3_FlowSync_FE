"use client";

import "./edit.css";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import axiosInstance from "@/src/api/axiosInstance";
import { Task, ContentBlock } from "@/src/types/taskTypes";
import { Box, Flex, Button, Text, Input } from "@chakra-ui/react";

// fetchTaskData 분리
const fetchTaskData = async (taskId: string): Promise<Task> => {
  const response = await axiosInstance.get<Task>(`/projects/1/tasks/${taskId}`);
  return response.data;
};

export default function EditPage() {
  const { taskId } = useParams() as { taskId: string };
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // EditorJS 관리
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  // **새로 첨부할 파일들 담을 배열
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // 서버에서 Task 불러오기
  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await fetchTaskData(taskId);
        setTask(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 가져오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId]);

  // API 엔드포인트 상수로 분리
  const API_ENDPOINTS = {
    uploadFile: process.env.NEXT_PUBLIC_UPLOAD_FILE_ENDPOINT || "",
    fetchUrl: process.env.NEXT_PUBLIC_FETCH_URL_ENDPOINT || "",
  };

  // API 헤더 상수로 분리
  const AUTH_HEADER = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ""}`,
  };

  // --- 2) EditorJS 초기화 ---
  useEffect(() => {
    if (!task || !editorContainerRef.current) return;

    // 기존 editorjs 인스턴스 중복 생성 방지. 안정 보장
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    // Task 의 content 배열을 블록 데이터 형식으로 변환
    const blocks = task.content?.map((block) => {
      if (block.type === "image") {
        return {
          type: "image",
          data: {
            file: {
              url: (block.data as { src: string }).src,
            },
          },
        };
      }
      return {
        type: "paragraph",
        data: {
          text: String(block.data),
        },
      };
    });

    // 새 인스턴스 생성
    editorRef.current = new EditorJS({
      holder: editorContainerRef.current,
      data: { blocks },
      tools: {
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                // 로컬 미리보기 URL 생성
                const previewUrl = URL.createObjectURL(file);

                // 즉시 미리보기 URL 반환
                const uploadResult = {
                  success: 1,
                  file: {
                    url: previewUrl, // 로컬 URL
                  },
                };

                // 서버에 파일 업로드
                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await axiosInstance.post(
                    "/upload",
                    formData
                  );

                  // 서버 업로드 성공: 반환된 URL로 교체
                  uploadResult.file.url = response.data.url;
                } catch (error) {
                  console.error("File upload failed:", error);
                }
                return uploadResult;
              },
            },
          },
        },
      },
      // 에디터 초기화 후 실행되는 확인용
      onReady: () => {
        console.log("Editor is ready");
      },
    });

    // useEffect Cleanup 함수. 컴포넌트 언마운트 될 때 editorjs 인스턴스 정리
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [task]);

  // 기존 첨부파일 삭제
  const handleRemoveOldFile = (index: number) => {
    if (!task) return;
    const updatedFiles = task.file.filter((_, i) => i !== index);
    setTask({ ...task, file: updatedFiles });
  };

  // --- 새 파일 추가 ---
  const handleSelectNewFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFiles((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  // 파일 슬롯 추가
  const handleAddFileSlot = () => {
    setNewFiles((prev) => [...prev, undefined as unknown as File]);
  };

  // 새 파일 슬롯 제거
  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 저장 ---
  const handleSave = async () => {
    if (!task || !editorRef.current) return;

    try {
      // editorjs 데이터를 변환
      const savedData: OutputData = await editorRef.current.save();
      const newContent: ContentBlock[] = savedData.blocks.map((block) => {
        if (block.type === "image") {
          return {
            type: "image",
            data: { src: block.data.file?.url || "" },
          };
        }
        return {
          type: "paragraph",
          data: block.data.text || "",
        };
      });

      // 2) 새 파일들(newFiles) 서버 업로드 → 업로드된 URL[]
      const uploadedFileUrls: string[] = [];
      for (const f of newFiles) {
        if (!f) continue; // 혹시 빈 슬롯이 있다면 무시
        const formData = new FormData();
        formData.append("file", f);

        // 실제 서버 업로드 예시
        const res = await axiosInstance.post("/upload", formData);
        // 백엔드 응답에서 업로드된 URL 얻었다고 가정
        uploadedFileUrls.push(res.data.url);
      }

      // 3) 최종 파일 목록 = (기존 파일 중 남아있는 것) + (새로 업로드된 URL)
      const finalFileList = [...task.file, ...uploadedFileUrls];

      // 4) task 갱신
      const updatedTask: Task = {
        ...task,
        content: newContent,
        file: finalFileList,
      };

      // 5) 서버에 PUT
      await axiosInstance.put(`/projects/1/tasks/${taskId}`, updatedTask);

      alert("수정 완료!");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <Box>로딩중...</Box>;
  if (error) return <Box>에러: {error}</Box>;
  if (!task) return <Box>데이터가 없습니다.</Box>;

  return (
    <Box maxW="800px" mx="auto" mt={10}>
      {/* 제목 */}
      <Box mb={4}>
        <Text mb={2}>제목</Text>
        <Input
          value={task.title || ""}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
      </Box>

      {/* 텍스트 편집창 */}
      <Box mb={4}>
        <Text mb={2}>상세 내용</Text>
        <Box
          ref={editorContainerRef}
          border="1px solid #ccc"
          minH="300px"
          p={2}
          borderRadius="md"
        />
      </Box>

      {/* (A) 기존 파일 목록 */}
      <Box mb={4}>
        <Text mb={2}>첨부파일</Text>
        {task.file &&
          task.file.map((fileUrl, idx) => (
            <Flex key={idx} alignItems="center" mb={2}>
              <Box flex="1">{fileUrl}</Box>
              <Button
                colorScheme="red"
                onClick={() => handleRemoveOldFile(idx)}
              >
                제거
              </Button>
            </Flex>
          ))}
      </Box>

      {/* (B) 새로 첨부할 파일 슬롯들 */}
      <Box mb={4}>
        {/* <Text mb={2}>새로 첨부할 파일</Text> */}

        {/* 지금까지 추가된 '슬롯'들 */}
        {newFiles.map((file, idx) => (
          <Flex key={idx} alignItems="center" mb={2}>
            <Input type="file" onChange={(e) => handleSelectNewFile(e, idx)} />

            <Button
              ml={2}
              colorScheme="red"
              onClick={() => handleRemoveNewFile(idx)}
            >
              제거
            </Button>
          </Flex>
        ))}

        {/* (C) '파일 추가' 버튼 -> 새 슬롯 추가 */}
        <Button onClick={handleAddFileSlot} mt={2} colorScheme="blue">
          파일 추가
        </Button>
      </Box>

      <Button onClick={handleSave} colorScheme="green">
        저장
      </Button>
    </Box>
  );
}
