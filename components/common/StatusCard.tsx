import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

interface StatusCardProps {
  count: number;
  label: string;
  iconSrc: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ count, label, iconSrc }) => {
  return (
    <Box
      background="white"
      width={340}
      height={170}
      border="1px solid #E2E8F0"
      borderRadius="lg"
      boxShadow="sm"
      padding={4}
    >
      <Flex alignItems="center" gap={4}>
        <Flex
          borderRadius="full"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          bg="green.50"
          w="85px"
          h="85px"
        >
          <Image src={iconSrc} alt={label} width={50} height={50} />
        </Flex>
        <Flex flexDirection={"column"}>
          <Text fontSize={46} fontWeight={700} color="gray.700">
            {count}
          </Text>
          <Text fontSize={24} fontWeight={400} color="gray.500">
            {label}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default StatusCard;
