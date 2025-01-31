// // 외부 라이브러리
// import { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Text,
//   Textarea,
//   Flex,
//   IconButton,
// } from "@chakra-ui/react";

// // 절대 경로 파일
// import { ArticleComment } from "@/src/types";
// import { LuSearch } from "react-icons/lu";

// interface CommentProps {
//   comment: ArticleComment;
// }


// export default function CommentItem({ comment }: CommentProps) {
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [openOptionId, setOpenOptionId] = useState<number | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       // 드롭다운 외부를 클릭하면 닫기
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpenOptionId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleOption = (id: number) => {
//     setOpenOptionId((prev) => (prev === id ? null : id));
//   };

//   const handleEdit = (id: number) => {
//     // 수정 로직 추가
//   };

//   const handleDelete = (id: number) => {
//     // 삭제 로직 추가
//   };

//   return (
//     <Box>
//       {comment.deletedYn === "Y" && (Array.isArray(comment.replies) || comment.replies.length === 0) ? null : (

//       {comment.deletedYn === "Y" ? (

//           <Text color="gray.500" fontStyle="italic">삭제된 댓글입니다</Text>

//       ) : ()}
//       )}
//     </Box>
//   );
// }
