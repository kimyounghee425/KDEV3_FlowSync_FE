"use client";

import { Box, Text } from "@chakra-ui/react";

interface ColorPickerButtonProps {
  label: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function ColorPickerButton({
  label,
  color,
  isSelected,
  onClick,
}: ColorPickerButtonProps) {
  return (
    <Box textAlign="center" position="relative">
      <Text fontSize="sm">{label}</Text>
      <Box
        width="40px"
        height="40px"
        backgroundColor={color}
        borderRadius="8px"
        cursor="pointer"
        display="inline-block"
        onClick={onClick}
        border={isSelected ? "2px solid black" : "1px solid #ccc"} // 선택 시 테두리 강조
      />
    </Box>
  );
}
