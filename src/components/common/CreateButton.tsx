import { Button } from "@chakra-ui/react";
import React from "react";

interface CreateButtonProps {
  handleButton: () => void;
}

export default function CreateButton({ handleButton }: CreateButtonProps) {
  return (
    <Button
      variant={"surface"}
      _hover={{ backgroundColor: "#00a8ff", color: "white" }}
      onClick={handleButton}
    >
      신규 등록
    </Button>
  );
}
