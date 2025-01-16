"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import StatusCard from "./ProjectsStatusCard";
import { Folder, PackageCheck, Signature, Swords, Wrench } from "lucide-react";

interface StatusCardsProps {
  title: string;
}

const StatusCards: React.FC<StatusCardsProps> = ({ title }) => {
  const data = [
    // 진행단계별 글 건수
    { id: 1, title: "전체", count: 28 }, // 전체
    { id: 2, title: "요구사항정의", count: 6 }, // 요구사항정의
    { id: 3, title: "화면설계", count: 6 }, // 화면설계
    { id: 4, title: "디자인", count: 8 }, // 디자인
    { id: 5, title: "퍼블리싱", count: 6 }, // 퍼블리싱
    { id: 6, title: "개발", count: 6 }, // 개발
    { id: 7, title: "검수", count: 0 }, // 검수
  ];
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
    { count: 28, label: "전체", icon: icons[0] },
    {
      count: 6,
      label: "계약",
      icon: icons[1],
    },
    {
      count: 6,
      label: "진행중",
      icon: icons[2],
    },
    {
      count: 8,
      label: "납품완료",
      icon: icons[3],
    },
    {
      count: 6,
      label: "하자보수",
      icon: icons[4],
    },
  ];

  // const [data, setData] = useState<
  //   { count: number; label: string; icon: ReactNode }[]
  // >([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchStatusSummary = async () => {
  //     try {
  //       setLoading(true);

  //       const response = await fetchProjectsStatusCount();
  //       const { statusSummary, total } = response;

  //       // 아이콘 배열 정의
  //       const icons = [
  //         <Folder key="1" size={40} color="gray" />,
  //         <Signature key="2" size={40} color="gray" />,
  //         <Swords key="3" size={40} color="gray" />,
  //         <PackageCheck key="4" size={40} color="gray" />,
  //         <Wrench key="5" size={40} color="gray" />,
  //       ];

  //       // 데이터 매핑
  //       const mappedData = [
  //         { count: total || 0, label: "전체", icon: icons[0] },
  //         {
  //           count: statusSummary["계약"] || 0,
  //           label: "계약",
  //           icon: icons[1],
  //         },
  //         {
  //           count: statusSummary["진행중"] || 0,
  //           label: "진행중",
  //           icon: icons[2],
  //         },
  //         {
  //           count: statusSummary["납품완료"] || 0,
  //           label: "납품완료",
  //           icon: icons[3],
  //         },
  //         {
  //           count: statusSummary["하자보수"] || 0,
  //           label: "하자보수",
  //           icon: icons[4],
  //         },
  //       ];

  //       setData(mappedData);
  //     } catch (error) {
  //       console.error("Failed to fetch status summary:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStatusSummary();
  // }, []);

  // if (loading) {
  //   return <Loading />;
  // }

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
        p={8}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md">
        {mappedData.map((item, index) => (
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
