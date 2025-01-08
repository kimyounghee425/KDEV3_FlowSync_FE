"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import StatusCard from "./ProjectsStatusCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "./Loading";

interface StatusCardsProps {
  title: string;
}

const StatusCards: React.FC<StatusCardsProps> = ({ title }) => {
  const [data, setData] = useState<
    { count: number; label: string; iconSrc: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusSummary = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${apiBaseUrl}/projects/status-summary`
        );

        const { statusSummary, total } = response.data;

        // 데이터 매핑
        const mappedData = [
          { count: total, label: "전체", iconSrc: "/contract.png" },
          {
            count: statusSummary["contract"] || 0,
            label: "계약",
            iconSrc: "/contract.png",
          },
          {
            count: statusSummary["inProgress"] || 0,
            label: "진행 중",
            iconSrc: "/running.png",
          },
          {
            count: statusSummary["completed"] || 0,
            label: "납품 완료",
            iconSrc: "/complete.png",
          },
          {
            count: statusSummary["maintenance"] || 0,
            label: "하자 보수",
            iconSrc: "/support.png",
          },
        ];

        setData(mappedData);
      } catch (error) {
        console.error("Failed to fetch status summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusSummary();
  }, []);

  if (loading) {
    return <Loading />;
  }

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
