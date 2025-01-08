import { Box, Text } from "@chakra-ui/react";

interface CustomBoxProps {
  children: string;
}

export const CustomBox = ({ children }: CustomBoxProps) => {
  const color = children === "진행중" ? "#21A366" : "#505050";
  return (
    <Box
      display="flex"
      backgroundColor="#F9F9F9"
      paddingX="8px"
      paddingY="4px"
      justifyContent="center"
      alignItems="center"
      borderRadius="6px"
      color={color}
      fontSize="14px"
      fontWeight="500"
      letterSpacing="-0.28px"
      width="100px"
    >
      {children}
    </Box>
  );
};
