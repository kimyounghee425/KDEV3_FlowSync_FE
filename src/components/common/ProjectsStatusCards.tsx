import { Box, Flex, Heading } from "@chakra-ui/react";
import StatusCard from "./ProjectsStatusCard";

interface StatusCardsProps {
  title: string;
}

const StatusCards: React.FC<StatusCardsProps> = ({ title }) => {
  // 목데이터 (백엔드에서 받은 데이터로 대체 가능)
  const data = [
    { count: 3, label: "계약", iconSrc: "/contract.png" },
    { count: 2, label: "진행 중", iconSrc: "/running.png" },
    { count: 4, label: "납품 완료", iconSrc: "/complete.png" },
    { count: 1, label: "하자 보수", iconSrc: "/support.png" },
  ];

  return (
    <Box mb={8}>
      <Heading size="2xl" mb={6} color="gray.700">
        {title}
      </Heading>
      <Flex wrap="wrap" gap={6} justify="center" bg="gray.50" p={8}>
        {data.map((item, index) => (
          <StatusCard
            key={index}
            count={item.count}
            label={item.label}
            iconSrc={item.iconSrc}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default StatusCards;
