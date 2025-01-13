import { useState } from "react";
import { Box, Text, VStack, StackProps } from "@chakra-ui/react";
import Comments from "./Comments";
import { TaskCommentsProps } from "@/src/types/taskTypes";

const TaskComments = ({ comments }: TaskCommentsProps) => {
  return (
    <Box>
      <Box
        my={4}
        borderBottom="1px solid"
        borderColor="gray.300"
        width="100%"
      />
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        댓글
      </Text>
      {comments.length > 0 ? (
        <Comments comments={comments} />
      ) : (
        <Text>댓글이 없습니다.</Text>
      )}
    </Box>
  );
};

export default TaskComments;