import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface StatusCardProps {
  count: number;
  label: string;
  icon: ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({ count, label, icon }) => {
  return (
    <Box
      background="white"
      width="250px"
      height="170px"
      border="1px solid #E2E8F0"
      borderRadius="lg"
      boxShadow="sm"
      padding={4}
    >
      <Flex alignItems="center" height="100%" gap={6}>
        <Flex
          border="1px solid #E2E8F0"
          borderRadius="full"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          w="85px"
          h="85px"
        >
          {icon}
        </Flex>
        <Flex flexDirection={"column"} alignItems={"center"}>
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
