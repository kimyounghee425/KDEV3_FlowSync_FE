import { Box, Text } from "@chakra-ui/react";
import { ArticleReply as ReplyType } from "@/src/types";

interface ReplyProps {
  reply: ReplyType;
}

const Reply = ({ reply }: ReplyProps) => {
  return (
    <Box mb={2}>
      <Text fontWeight="bold" fontSize="sm">
        {reply.author}
      </Text>
      <Text fontSize="sm" color="gray.500">
        {reply.regAt}
      </Text>
      <Text mt={1}>{reply.content}</Text>
    </Box>
  );
};

export default Reply;
