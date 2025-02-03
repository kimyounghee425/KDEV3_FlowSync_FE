import React, { useRef } from "react";
import { Text, Box, Button } from "@chakra-ui/react";
import { uploadFileApi } from "@/src/api/RegisterArticle";
interface UploadedFilesProps {
  originalName: string;
  saveName: string;
  url: string;
  size: number;
}

interface FileAddSectionProps {
  uploadedFiles: UploadedFilesProps[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFilesProps[]>>;
  uploadedFileSize: number[];
  setUploadedFileSize: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function FileAddSection({
  uploadedFiles,
  setUploadedFiles,
  uploadedFileSize,
  setUploadedFileSize,
}: FileAddSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log(formData);

      const responseData = await uploadFileApi(file);

      const responseFileData: UploadedFilesProps = responseData.data; // 이게 파일 배열에 넣어야 할 객체
      setUploadedFiles((prev) => [...prev, responseFileData]);

      setUploadedFileSize((prev) => [...prev, responseFileData.size]);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드 중 문제가 발생했습니다.");
      return null;
    }
  };

  // 파일 추가
  const handleAddFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "block";

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        handleFileUpload(file);
        if (containerRef.current) {
          containerRef.current.appendChild(input);
        }
      }
    };
    input.click();
  };

  // 파일 삭제
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일 크기 변환 함수
  const formatFileSize = (size: number): string => {
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + "MB";
    } else if (size >= 1024) {
      return (size / 1024).toFixed(2) + "KB";
    }
    return size + "B";
  };

  return (
    <Box mt={6}>
      <Text fontWeight="bold" mb={2}>
        첨부 파일
      </Text>

      <Button onClick={handleAddFile} colorScheme={"blue"}>
        파일 추가
      </Button>
      <Box display={"flex"} flexDirection={"col"}>
        <Box
          ref={containerRef}
          mt={4}
          display={"flex"}
          flexDirection={"column"}
        ></Box>

        <Box>
          {uploadedFiles.map((file, index) => (
            <Box key={index} display={"flex"} alignItems={"center"} mt={4}>
              <Text>
                파일 이름: {file.originalName}, 파일 크기 :{" "}
                {formatFileSize(file.size)} byte
              </Text>
              <Button onClick={() => handleRemoveFile(index)}>삭제</Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
