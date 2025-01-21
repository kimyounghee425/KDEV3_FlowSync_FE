"use client";

import { useRouter } from "next/navigation";
import { Box, Flex, Heading, HStack, Table, Text } from "@chakra-ui/react";
import { Layers, List } from "lucide-react";
import ProjectInfo from "@/src/components/pages/projectPage/components/ProjectInfo";
import ProgressStepSection from "@/src/components/pages/projectPage/components/ProgressStepSection";
import BoardSearchSection from "@/src/components/pages/projectPage/components/BoardSearchSection";
import CommonTable from "@/src/components/common/CommonTable";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import { useProjectBoard } from "@/src/hook/useProjectBoard";
import CustomColorBox from "@/src/components/common/StatusTag";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const projectInfo = {
  projectTitle: "커넥티드에듀",
  description: "웹 랜딩페이지 개발 건",
  jobRole: "비엔시스템PM",
  profileImageUrl: "https://i.pravatar.cc/300?u=iu",
  name: "이태영",
  jobTitle: "본부장",
  phoneNum: "010-1234-1324",
  projectStartAt: "2024년 9월 1일",
  projectCloseAt: "2024년 12월 31일",
};

export default function ProjectPage({ params }: ProjectPageProps) {
  // const { projectId, projectInfo, loading } = useProjectInfo(params);

  // if (loading || !projectInfo) return <Loading />;

  // const [projectId, setProjectId] = useState<string>();

  // 커스텀 훅: 게시판 데이터(boardList), 프로젝트 ID, 업무글 ID, 로딩 상태 등을 제공
  const { boardList, projectId, taskId, loading } = useProjectBoard();

  const router = useRouter();

  // const getProjectId = useCallback(async () => {
  //   setProjectId((await params).projectId);
  // }, [params]);
  // useEffect(() => {
  //   getProjectId();
  // }, [getProjectId]);

  /**
   * 테이블 행 클릭 시 호출되는 함수
   * @param id 게시글(또는 작업)의 식별자
   * 프로젝트 상세 -> 업무글 상세로 이동하게 해줌
   */
  const handleRowClick = (id: number) => {
    router.push(`/projects/${projectId}/tasks/${id}`);
  };

  return (
    <>
      {/* 
        상단 영역: 프로젝트 제목/설명 + SegmentedControl (업무관리 / 진척관리 탭 전환)
        그리고 ProjectInfo 컴포넌트로 담당자 정보, 일정, 역할 등을 표시
      */}
      <Flex
        direction="column"
        padding="30px 23px"
        gap="8px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        mb="30px"
      >
        {/* 제목과 업무관리/진척관리 탭 */}
        <Flex justifyContent={"space-between"}>
          {/* 프로젝트 이름 + 부가 설명 */}
          <Flex gap="10px">
            <Heading size={"4xl"}>{projectInfo.projectTitle}</Heading>
            <Text fontWeight="500" color="#BBB" fontSize="20px">
              {projectInfo.description}
            </Text>
          </Flex>
          {/* SegmentedControl: 두 가지 탭 (업무관리, 진척관리) */}
          <SegmentedControl
            defaultValue="task"
            items={[
              {
                value: "task",
                label: (
                  <HStack>
                    <List />
                    업무관리
                  </HStack>
                ),
              },
              {
                value: "progress",
                label: (
                  <HStack>
                    <Layers />
                    진척관리
                  </HStack>
                ),
              },
            ]}
          />
        </Flex>
        {/* 프로젝트 정보(담당자, 연락처, 일정 등)를 표시하는 컴포넌트 */}
        <ProjectInfo projectInfo={projectInfo} />
      </Flex>
      {/* 
        ProgressStepSection: 프로젝트 단계(예: 디자인, 개발 ,검수 등)를
        단계별 업무글 개수와 함께 표현하는 컴포넌트
      */}
      <ProgressStepSection projectId={projectId as string} />

      {/* 
        게시판(업무, 진척)에 대한 검색 옵션 섹션 & 테이블
      */}
      <Box
        direction="column"
        padding="30px 23px"
        gap="8px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        mb="30px"
      >
        {/* 검색 영역 (키워드, 필터 등)를 제공하는 컴포넌트 */}
        <BoardSearchSection />
        {/* 
          CommonTable: 게시글 목록을 렌더링하는 공통 테이블 컴포넌트
          - headerTitle: 테이블 헤더
          - data: 목록 데이터
          - loading: 로딩 상태
          - renderRow: 각 행의 셀을 어떻게 렌더링할지 정의
          - handleRowClick: 행 클릭 시 동작
        */}
        <CommonTable
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성일</Table.ColumnHeader>
              <Table.ColumnHeader>게시글 상태</Table.ColumnHeader>
              <Table.ColumnHeader>게시글 유형</Table.ColumnHeader>
            </Table.Row>
          }
          data={boardList}
          loading={loading}
          renderRow={(item) => (
            <>
              <Table.Cell>{item.title}</Table.Cell>
              <Table.Cell>{item.regAt}</Table.Cell>
              <Table.Cell>
                <CustomColorBox>{item.boardStatus}</CustomColorBox>
              </Table.Cell>
              <Table.Cell>
                <CustomColorBox>{item.boardCategory}</CustomColorBox>
              </Table.Cell>
            </>
          )}
          handleRowClick={handleRowClick}
        />
      </Box>
    </>
  );
}
