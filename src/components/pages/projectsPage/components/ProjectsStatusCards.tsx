"use client";

import { Box, Flex, Heading, useBreakpointValue } from "@chakra-ui/react";
import { Folder, PackageCheck, Signature, Swords, Wrench } from "lucide-react";
import StatusCard from "@/src/components/pages/projectsPage/components/ProjectsStatusCard";

// 아이콘 배열 정의
const icons = [
  <Folder key="1" size="60%" color="gray" />,
  <Signature key="2" size="60%" color="gray" />,
  <Swords key="3" size="60%" color="gray" />,
  <PackageCheck key="4" size="60%" color="gray" />,
  <Wrench key="5" size="60%" color="gray" />,
];

// 데이터 매핑
const mappedData = [
  { id: 1, count: 28, label: "전체", icon: icons[0] },
  { id: 2, count: 6, label: "계약", icon: icons[1] },
  { id: 3, count: 8, label: "진행중", icon: icons[2] },
  { id: 4, count: 8, label: "납품완료", icon: icons[3] },
  { id: 5, count: 6, label: "하자보수", icon: icons[4] },
];

interface ProjectsStatusCardsProps {
  title: string;
}
// 프로젝트 현황을 하나 보여주는 카드
export default function ProjectsStatusCards({
  title,
}: ProjectsStatusCardsProps) {
  // 반응형 크기 조정
  const cardSize = useBreakpointValue({
    base: "80px", // 모바일: 카드 크기 작게
    sm: "100px", // 작은 태블릿: 중간 크기
    md: "120px", // 데스크탑: 기본 크기
  });

  const fontSize = useBreakpointValue({
    base: "sm", // 모바일: 작은 글씨
    sm: "md", // 태블릿: 중간 글씨
    md: "lg", // 데스크탑: 큰 글씨
  });

  const gap = useBreakpointValue({
    base: 4, // 모바일: 좁은 간격
    sm: 6, // 태블릿: 중간 간격
    md: 8, // 데스크탑: 넓은 간격
  });
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
      <Heading size="2xl" color="gray.700" mb="10px" textAlign="left">
        {title}
      </Heading>
      {/* 카드 컨테이너 */}

      <Flex
        wrap="nowrap"
        justifyContent="center"
        alignItems="center"
        gap={gap}
        p={8}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        overflowX="hidden" // 가로 스크롤 방지
      >
        {mappedData.map((item) => (
          <StatusCard
            key={item.id}
            count={item.count}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </Flex>
    </Box>
  );
}
