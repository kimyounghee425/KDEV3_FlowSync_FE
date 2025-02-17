import { Button } from "@chakra-ui/react";
import React from "react";

interface CreateButtonProps {
  handleButton: () => void;
}

export default function CreateButton({ handleButton }: CreateButtonProps) {
  return (
    <Button
      backgroundColor="#00a8ff"
      color="white"
      border="none"
      transition="all 0.3s ease"
      _hover={{
        backgroundColor: "#1f98d4",
        cursor: "pointer",
      }}
      onClick={handleButton}
    >
      신규 등록
    </Button>
  );
}
