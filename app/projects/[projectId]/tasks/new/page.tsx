// 새 글을 생성하는 페이지 new

"use client";
// 목데이터 사용
import { new_task_data } from "@/src/data/new_task_data";
import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/backButton";
import Form from "@/src/components/common/TaskForm";

export default function New() {
  const [author, setAuthor] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<string>("");

  
  useEffect(() => {
    setAuthor(new_task_data.userName);
    const currentDate = new Date().toISOString().slice(0, 10);
    setCreatedDate(currentDate);
  }, []);
  

  return (
    <Box
      maxW="1000px"
      w={"100%"}
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />

      <Form author={author} createdDate={createdDate} />
    </Box>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import ImageTool from "@editorjs/image";
// import List from "@editorjs/list";
// import {
//   Box,
//   Input,
//   Button,
//   VStack,
//   HStack,
//   Text,
// } from "@chakra-ui/react";
// import BackButton from "@/src/components/common/backButton";
// import { useParams } from "next/navigation";

// export default function Edit() {
//   const { taskId } = useParams();
//   const editorRef = useRef<EditorJS | null>(null);
//   const [title, setTitle] = useState<string>("");
//   const [summary, setSummary] = useState<string>("");
//   const [link, setLink] = useState<string>("");
//   const [attachments, setAttachments] = useState<File[]>([]);

//   useEffect(() => {
//     // Initialize Editor.js
//     if (!editorRef.current) {
//       editorRef.current = new EditorJS({
//         holder: "editorjs",
//         tools: {
//           header: Header,
//           list: List,
//           image: {
//             class: ImageTool,
//             config: {
//               endpoints: {
//                 byFile: "/uploadFile", // Replace with your API endpoint for file upload
//                 byUrl: "/fetchUrl",   // Replace with your API endpoint for URL fetch
//               },
//             },
//           },
//         },
//         data: {
//           time: new Date().getTime(),
//           blocks: [
//             {
//               type: "header",
//               data: {
//                 text: "제목을 입력하세요",
//                 level: 2,
//               },
//             },
//             {
//               type: "paragraph",
//               data: {
//                 text: "내용을 작성하세요",
//               },
//             },
//           ],
//         },
//       });
//     }

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.destroy();
//         editorRef.current = null;
//       }
//     };
//   }, []);

//   const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setAttachments([...attachments, file]);
//     }
//   };

//   const handleAttachmentDelete = (index: number) => {
//     setAttachments(attachments.filter((_, i) => i !== index));
//   };

//   const handleSave = async () => {
//     if (editorRef.current) {
//       const savedData = await editorRef.current.save();
//       console.log("Saved data:", savedData);
//       console.log("Attachments:", attachments);
//     }
//   };

//   return (
//     <Box>
//       <BackButton />

//       <Box mb={5}>
//         <Text fontWeight="bold">제목</Text>
//         <Input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="제목을 입력하세요."
//         />
//       </Box>

//       <Box mb={5}>
//         <Text fontWeight="bold" mb={2}>
//           내용
//         </Text>
//         <Box
//           id="editorjs"
//           border="1px solid #ccc"
//           padding="10px"
//           borderRadius="5px"
//           minHeight="300px"
//         ></Box>
//       </Box>

//       <Box mb={5}>
//         <Text fontWeight="bold" mb={2}>
//           질문 요약
//         </Text>
//         <Input
//           value={summary}
//           onChange={(e) => setSummary(e.target.value)}
//           placeholder="요약을 입력하세요."
//         />
//       </Box>

//       <Box mb={5}>
//         <Text fontWeight="bold" mb={2}>
//           링크 첨부
//         </Text>
//         <Input
//           value={link}
//           onChange={(e) => setLink(e.target.value)}
//           placeholder="링크(URL)를 입력하세요."
//         />
//       </Box>

//       <Box mb={5}>
//         <Text fontWeight="bold" mb={2}>
//           첨부파일
//         </Text>
//         <VStack align="start">
//           {attachments.map((file, index) => (
//             <HStack key={index}>
//               <Text>{file.name}</Text>
//               <Button size="sm" onClick={() => handleAttachmentDelete(index)}>
//                 삭제
//               </Button>
//             </HStack>
//           ))}
//           <Input type="file" onChange={handleAttachmentUpload} />
//         </VStack>
//       </Box>

//       <Button onClick={handleSave}>저장</Button>
//     </Box>
//   );
// }
