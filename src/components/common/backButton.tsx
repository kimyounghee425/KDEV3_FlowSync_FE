import { Box, Button } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";

const BackButton = () => (


  <Box position={"relative"} w={"100"} mb={4}>
    <Button

      bg={"white"}
      color={"black"}
      colorScheme={"blackAlpha"}
      _hover={{ bg: "blackAlpha.300" }}
    >
      <BiArrowBack />
    </Button>
  </Box>
);

export default BackButton;