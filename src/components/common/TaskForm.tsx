import { Box, Input, Textarea, Text, Flex, Button } from "@chakra-ui/react";

const Form = ({
  author,
  createdDate,
}: {
  author: string;
  createdDate: string;
}) => {
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

      <Box>
        <Text mb={2}>상세 내용</Text>
        <Textarea placeholder="내용을 입력하세요." />
      </Box>

      <Box>
        <Text mb={2}>질문 요약</Text>
        <Input placeholder="질문을 입력하세요." height={"50px"} />
      </Box>

      <Box>
        <Text mb={2}>링크 첨부</Text>
        <Input type="url" placeholder="링크(URL)를 입력하세요" />
      </Box>

      <Box>
        <Text mb={2}>첨부 파일</Text>
        <Input type="file" placeholder="첨부 파일을 업로드하세요" />
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
      >
        작성
      </Button>
    </Flex>
  );
};

export default Form;
