import { Button } from "@chakra-ui/react";
import React from "react";

interface EditButtonProps {
  handleButton: () => void;
}

export default function EditButton({ handleButton }: EditButtonProps) {
  return (
    <Button
      variant={"surface"}
      _hover={{ backgroundColor: "#00a8ff", color: "white" }}
      onClick={handleButton}
    >
      수정
    </Button>
  );
}
