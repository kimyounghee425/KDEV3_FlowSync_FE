"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import StatusCard from "./ProjectsStatusCard";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "./Loading";
import { Folder, PackageCheck, Signature, Swords, Wrench } from "lucide-react";

interface StatusCardsProps {
  title: string;
}

const StatusCards: React.FC<StatusCardsProps> = ({ title }) => {
  const [data, setData] = useState<
    { count: number; label: string; icon: ReactNode }[]
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

        // 아이콘 배열 정의
        const icons = [
          <Folder key="1" size={40} color="gray" />,
          <Signature key="2" size={40} color="gray" />,
          <Swords key="3" size={40} color="gray" />,
          <PackageCheck key="4" size={40} color="gray" />,
          <Wrench key="5" size={40} color="gray" />,
        ];

        // 데이터 매핑
        const mappedData = [
          { count: total || 0, label: "전체", icon: icons[0] },
          {
            count: statusSummary["contract"] || 0,
            label: "계약",
            icon: icons[1],
          },
          {
            count: statusSummary["inProgress"] || 0,
            label: "진행 중",
            icon: icons[2],
          },
          {
            count: statusSummary["completed"] || 0,
            label: "납품 완료",
            icon: icons[3],
          },
          {
            count: statusSummary["maintenance"] || 0,
            label: "하자 보수",
            icon: icons[4],
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
    <Box mb="50px">
      <Heading size="2xl" color="gray.700" mb="10px">
        {title}
      </Heading>
      <Flex
        wrap="wrap"
        justifyContent="center"
        alignItems="center"
        gap={8}
        justify="center"
        bg="gray.50"
        p={8}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md">
        {data.map((item, index) => (
          <StatusCard
            key={index}
            count={item.count}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default StatusCards;
