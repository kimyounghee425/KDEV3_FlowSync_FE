// 버튼 아래에 드롭다운 펼쳐지는 컴포넌트

import { Box, Button, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import DropDownInfoTop from "./DropDownInfoTop";

interface DropdownInfoProps {
  text: string;
}

export default function DropDownInfoBottom({ text }: DropdownInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box position="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="outline"
        border={"none"}
      >
        <Image src="/545674.png" alt="Help Icon" width={20} height={20} />
      </Button>

      {isOpen && (
        <Box
          position="absolute"
          top="40px"
          left="0"
          minWidth="200px"
          bg="white"
          border="1px solid #ccc"
          borderRadius="8px"
          boxShadow="md"
          p="4"
          zIndex="9999"
        >
          {text.split("\n").map((line, index) => (
            <Text key={index} fontSize="sm" mt="2">
              {line}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}
