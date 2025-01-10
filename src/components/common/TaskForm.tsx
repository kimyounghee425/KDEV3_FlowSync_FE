// import { Box, Input, Textarea, Text, Flex, Button } from "@chakra-ui/react";

// const Form = ({
//   author,
//   createdDate,
// }: {
//   author: string;
//   createdDate: string;
// }) => {
//   return (
//     <Flex gap={4} direction={"column"}>
//       <Box>
//         <Text mb={2}>제목</Text>
//         <Input placeholder="제목을 입력하세요." />
//       </Box>

//       <Flex align={"center"} gap={4} width={"100%"}>
//         <Box
//           display={"flex"}
//           flexDirection={"column"}
//           alignItems={"left"}
//           flex={"1"}
//         >
//           <Text mb={2}>작성자</Text>
//           <Input type="text" value={author} readOnly />
//         </Box>
//         <Box
//           display={"flex"}
//           flexDirection={"column"}
//           alignItems={"start"}
//           flex={"1"}
//         >
//           <Text mb={2}>작성 일시</Text>
//           <Input type="date" value={createdDate} readOnly />
//         </Box>
//       </Flex>

//       <Box>
//         <Text mb={2}>상세 내용</Text>
//         <Textarea placeholder="내용을 입력하세요." />
//       </Box>

//       <Box>
//         <Text mb={2}>질문 요약</Text>
//         <Input placeholder="질문을 입력하세요." height={"50px"} />
//       </Box>

//       <Box>
//         <Text mb={2}>링크 첨부</Text>
//         <Input type="url" placeholder="링크(URL)를 입력하세요" />
//       </Box>

//       <Box>
//         <Text mb={2}>첨부 파일</Text>
//         <Input type="file" placeholder="첨부 파일을 업로드하세요" />
//       </Box>

//       <Button
//         bg={"red.500"}
//         colorScheme={"red"}
//         width={"auto"}
//         px={6}
//         py={4}
//         borderRadius={"full"}
//         fontSize={"lg"}
//         fontWeight={"bold"}
//         boxShadow={"md"}
//         _hover={{ bg: "red.600" }}
//       >
//         작성
//       </Button>
//     </Flex>
//   );
// };

// export default Form;

import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";

const Form = ({
  author,
  createdDate,
}: {
  author: string;
  createdDate: string;
}) => {
  const editorRef = useRef<EditorJS | null>(null);

  // 첨부파일
  const [files, setFiles] = useState<(File | null)[]>([]);
  
  // 새 파일 입력 추가
  const handleAddFile = () => {
    setFiles([...files, null]);
  };

  // 파일 업데이트
  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = [...files];
    const file = event.target.files ? event.target.files[0] : null;
    newFiles[index] = file;
    setFiles(newFiles);
  };

  // 특정 파일 제거
  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        tools: {
          // header: Header,
          // list: List,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "/uploadFile", // Replace with your API endpoint for file upload
                byUrl: "/fetchUrl", // Replace with your API endpoint for URL fetch
              },
              field: "image",
              types: "image/*",
              additionalRequestHeaders: {
                Authorization: "Bearer <your-token>", // 이거 뭔뜻이지
              }
            },
          },
        },
        placeholder: "내용을 작성하세요",
        data: {
          time: new Date().getTime(),
          blocks: [
            // {
            //   type: "header",
            //   data: {
            //     text: "",
            //     level: 2,
            //   },
            // },
            // {
            //   type: "paragraph",
            //   data: {
            //     text: "",
            //   },
            // },
          ],
        },
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      const savedData = await editorRef.current.save();
      console.log("Saved data:", savedData);
    }
  };

  return (
    <Flex gap={4} direction={"column"}>
      <Box>
        <Text mb={2}>제목</Text>
        <Input placeholder="제목을 입력하세요." />
      </Box>

      <Flex align={"center"} gap={4} width={"100%"}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"left"}
          flex={"1"}
        >
          <Text mb={2}>작성자</Text>
          <Input type="text" value={author} readOnly />
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
          flex={"1"}
        >
          <Text mb={2}>작성 일시</Text>
          <Input type="date" value={createdDate} readOnly />
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

      <Box>
        <Text mb={2}>질문 요약</Text>
        <Input placeholder="질문을 입력하세요." height={"50px"} />
      </Box>

      <Box>
        <Text mb={2}>링크 첨부</Text>
        <Input type="url" placeholder="링크(URL)를 입력하세요" />
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
};

export default Form;
