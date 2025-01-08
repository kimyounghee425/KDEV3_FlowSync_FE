import { Button, Textarea, Box } from "@chakra-ui/react";

const CommentBox = () => {
    return (<Box>
        <Textarea placeholder="댓글을 입력하세요." />
        <Button mt={2} colorScheme="blue">댓글 작성</Button>
    </Box>)
}

export default CommentBox;