// 외부 라이브러리
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Textarea,
  Flex,
  IconButton,
} from "@chakra-ui/react";

// 절대 경로 파일
import { ArticleComment } from "@/src/types";
import { LuSearch } from "react-icons/lu";

interface CommentProps {
  comment: ArticleComment;
}


export default function CommentItem({ comment }: CommentProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openOptionId, setOpenOptionId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 드롭다운 외부를 클릭하면 닫기
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenOptionId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (id: number) => {
    setOpenOptionId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (id: number) => {
    // 수정 로직 추가
  };

  const handleDelete = (id: number) => {
    // 삭제 로직 추가
  };

  return (
    <Box>
      {comment.deletedYn === "Y" && (Array.isArray(comment.replies) || comment.replies.length === 0) ? null : (

      {comment.deletedYn === "Y" ? (

          <Text color="gray.500" fontStyle="italic">삭제된 댓글입니다</Text>

      ) : ()}
      )}
    </Box>
  );
}

    // <Box mb={4} p={4} borderWidth={1} borderRadius="md" position="relative">
    //   {comment.deletedYn === "Y" ? (
    //     <>
    //       <Text color="gray.500" fontStyle="italic">
    //         삭제된 댓글입니다.
    //       </Text>
    //       {comment.replies.length > 0 && (
    //         <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
    //           {comment.replies
    //             .filter((reply) => reply.deletedYn === "N")
    //             .map((reply) => (
    //               <Box key={reply.id} mb={4} position="relative">
    //                 <Flex alignItems="center" justifyContent="space-between">
    //                   <Text fontWeight="bold">{reply.author}</Text>
    //                   <Text fontSize="sm" color="gray.500">
    //                     {reply.regAt
    //                       .split(".")[0]
    //                       .replace("Z", "")
    //                       .slice(0, 10)}
    //                   </Text>
    //                   <IconButton
    //                     aria-label="댓글 옵션"
    //                     size="sm"
    //                     variant="ghost"
    //                     position="absolute"
    //                     top="4px"
    //                     right="4px"
    //                     onClick={() => toggleOption(reply.id)}
    //                   >
    //                     <LuSearch />
    //                   </IconButton>
    //                   {openOptionId === reply.id && (
    //                     <Box
    //                       ref={dropdownRef} // 드롭다운 영역
    //                       position="absolute"
    //                       top="36px"
    //                       right="4px"
    //                       bg="white"
    //                       border="1px solid #ccc"
    //                       borderRadius="md"
    //                       boxShadow="md"
    //                       zIndex={10}
    //                       py={1}
    //                     >
    //                       {/* <Button
    //                         variant="ghost"
    //                         size="sm"
    //                         w="100%"
    //                         justifyContent="flex-start"
    //                         onClick={handleEdit()}
    //                       >
    //                         수정                    삭제된 댓글의 대댓은 수정 불가능
    //                       </Button> */}
    //                       <Button
    //                         variant="ghost"
    //                         size="sm"
    //                         w="100%"
    //                         justifyContent="flex-start"
    //                         onClick={() => handleDelete(reply.id)}
    //                       >
    //                         삭제
    //                       </Button>
    //                     </Box>
    //                   )}
    //                 </Flex>
    //                 <Box mt={2}>
    //                   <Text>{reply.content}</Text>
    //                 </Box>
    //               </Box>
    //             ))}
    //         </Box>
    //       )}
    //     </>
    //   ) : (
    //     <>
    //       <Text fontWeight="bold">{comment.author}</Text>
    //       <Text fontSize="sm" color="gray.500">
    //         {comment.regAt.split(".")[0].replace("Z", "").slice(0, 10)}
    //       </Text>
    //       <Text mt={2}>{comment.content}</Text>
    //       <IconButton
    //         aria-label="댓글 옵션"
    //         size="sm"
    //         variant="ghost"
    //         position="absolute"
    //         top="4px"
    //         right="4px"
    //         onClick={() => toggleOption(comment.id)}
    //       >
    //         <LuSearch />
    //       </IconButton>
    //       {openOptionId === comment.id && (
    //         <Box
    //           ref={dropdownRef} // 드롭다운 영역
    //           position="absolute"
    //           top="36px"
    //           right="4px"
    //           bg="white"
    //           border="1px solid #ccc"
    //           borderRadius="md"
    //           boxShadow="md"
    //           zIndex={10}
    //           py={1}
    //         >
    //           <Button
    //             variant="ghost"
    //             size="sm"
    //             w="100%"
    //             justifyContent="flex-start"
    //             onClick={() => handleEdit(comment.id)}
    //           >
    //             수정
    //           </Button>
    //           <Button
    //             variant="ghost"
    //             size="sm"
    //             w="100%"
    //             justifyContent="flex-start"
    //             onClick={() => handleDelete(comment.id)}
    //           >
    //             삭제
    //           </Button>
    //         </Box>
    //       )}

    //       {comment.replies.length > 0 && (
    //         <Box mt={4} pl={6} borderLeft="2px solid" borderColor="gray.200">
    //           {comment.replies
    //             .filter((reply) => reply.deletedYn === "N")
    //             .map((reply) => (
    //               <Box key={reply.id} mb={4} position="relative">
    //                 <Flex alignItems="center" justifyContent="space-between">
    //                   <Text fontWeight="bold">{reply.author}</Text>
    //                   <Text fontSize="sm" color="gray.500">
    //                     {reply.regAt}
    //                   </Text>
    //                   <IconButton
    //                     aria-label="댓글 옵션"
    //                     size="sm"
    //                     variant="ghost"
    //                     position="absolute"
    //                     top="4px"
    //                     right="4px"
    //                     onClick={() => toggleOption(reply.id)}
    //                   >
    //                     <LuSearch />
    //                   </IconButton>
    //                   {openOptionId === reply.id && (
    //                     <Box
    //                       ref={dropdownRef} // 드롭다운 영역
    //                       position="absolute"
    //                       top="36px"
    //                       right="4px"
    //                       bg="white"
    //                       border="1px solid #ccc"
    //                       borderRadius="md"
    //                       boxShadow="md"
    //                       zIndex={10}
    //                       py={1}
    //                     >
    //                       <Button
    //                         variant="ghost"
    //                         size="sm"
    //                         w="100%"
    //                         justifyContent="flex-start"
    //                         onClick={() => handleEdit(reply.id)}
    //                       >
    //                         수정
    //                       </Button>
    //                       <Button
    //                         variant="ghost"
    //                         size="sm"
    //                         w="100%"
    //                         justifyContent="flex-start"
    //                         onClick={() => handleDelete(comment.id)}
    //                       >
    //                         삭제
    //                       </Button>
    //                     </Box>
    //                   )}
    //                 </Flex>
    //                 <Box mt={2}>
    //                   <Text>{reply.content}</Text>
    //                 </Box>
    //               </Box>
    //             ))}
    //         </Box>
    //       )}
    //     </>
    //   )}
    // </Box>