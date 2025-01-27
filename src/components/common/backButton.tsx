import { Box, Button } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function BackButton() {

  return (
    <Box position={"relative"} w={"100"} mb={4}>
      <Button
        bg={"white"}
        color={"black"}
        colorScheme={"blackAlpha"}
        _hover={{ bg: "blackAlpha.300" }}
        onClick={() => window.history.back()}
      >
        <BiArrowBack />
      </Button>
    </Box>
  );
}
