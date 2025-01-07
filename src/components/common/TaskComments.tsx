import { Box, Text } from "@chakra-ui/react";

const TaskComments = ({ comments }: { comments: any[] }) => {
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
        comments.map((comment) => (
          <Box key={comment.id} mb={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">{comment.author}</Text>
            <Text fontSize="sm" color="gray.500">
              {comment.createdDate}
            </Text>
            <Text mt={2}>{comment.content}</Text>
          </Box>
        ))
      ) : (
        <Text>댓글이 없습니다.</Text>
      )}
    </Box>
  );
};

export default TaskComments;