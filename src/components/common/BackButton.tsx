import { Box, Button } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";

export default function BackButton() {
  return (
    <Button
      bg="white"
      color="black"
      colorScheme="blackAlpha"
      _hover={{ bg: "blackAlpha.300" }}
      onClick={() => window.history.back()}
      boxShadow="md"
      borderRadius="full"
      padding="0.75rem" // 버튼 크기 조정
      display="flex"
      alignItems="center"
    >
      <BiArrowBack size="1.25rem" />
    </Button>
  );
}
