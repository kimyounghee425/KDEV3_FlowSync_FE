"use client";

import { Heading, Table } from "@chakra-ui/react";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import ProjectsManagementStepCards from "@/src/components/pages/ProjectWorkFlowPage/components/ProjectManagementStepCards";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import CommonTable from "@/src/components/common/CommonTable";
import { useProjectList } from "@/src/hook/useFetchBoardList";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { useUserInfo } from "@/src/hook/useFetchData";
import StatusTag from "@/src/components/common/StatusTag";

export default function ProjectWorkFlowPage() {
  const textColor = useColorModeValue("gray.700", "gray.200");

  // 현재 로그인 한 사용자 정보
  const { data: loggedInUserInfo } = useUserInfo();
  const userRole = loggedInUserInfo?.role; // 기본값 설정

  // const {
  //   data: projectList,
  //   loading: projectListLoading,
  //   error: projectListError,
  // } = useProjectList(keyword, managementStep, currentPage, pageSize);

  return (
    <>
      <ProjectLayout>
        <ProjectsManagementStepCards title={"관리 단계 변경"} />
      </ProjectLayout>
      <Heading size="2xl" color={textColor} lineHeight="base">
        진행단계 요약
      </Heading>
      {/* {projectListError && (
        <ErrorAlert message="프로젝트 목록을 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      {/*
       * 공통 테이블(CommonTable)
       *  - headerTitle: 테이블 헤더 구성
       *  - data: 테이블에 표시될 데이터
       *  - loading: 로딩 상태
       *  - renderRow: 한 줄씩 어떻게 렌더링할지 정의 (jsx 반환)
       *  - handleRowClick: 행 클릭 이벤트 핸들러
       */}

      {/* <CommonTable
        headerTitle={
          <Table.Row
            backgroundColor={useColorModeValue("#eee", "gray.700")}
            css={{
              "& > th": { textAlign: "center" },
            }}
          >
            <Table.ColumnHeader>프로젝트명</Table.ColumnHeader>
            <Table.ColumnHeader>고객사</Table.ColumnHeader>
            <Table.ColumnHeader>개발사</Table.ColumnHeader>
            <Table.ColumnHeader>관리단계</Table.ColumnHeader>
            <Table.ColumnHeader>시작일</Table.ColumnHeader>
            <Table.ColumnHeader>예정 마감일</Table.ColumnHeader>
            <Table.ColumnHeader>납품 완료일</Table.ColumnHeader>
            {userRole === "ADMIN" ? (
              <>
                <Table.ColumnHeader>수정일</Table.ColumnHeader>
                <Table.ColumnHeader>삭제여부</Table.ColumnHeader>
                <Table.ColumnHeader>공지사항관리</Table.ColumnHeader>
              </>
            ) : (
              <></>
            )}
          </Table.Row>
        }
        data={projectList}
        loading={projectListLoading}
        renderRow={(project) => (
          <>
            <Table.Cell>{project.name}</Table.Cell>
            <Table.Cell>{project.customerName}</Table.Cell>
            <Table.Cell>{project.developerName}</Table.Cell>
            <Table.Cell>
              <StatusTag>
                {STATUS_LABELS[project.managementStep] || "알 수 없음"}
              </StatusTag>
            </Table.Cell>
            <Table.Cell>{formatDynamicDate(project.startAt)}</Table.Cell>
            <Table.Cell>{formatDynamicDate(project.deadlineAt)}</Table.Cell>
            <Table.Cell>{formatDynamicDate(project.closeAt)}</Table.Cell>
            {userRole === "ADMIN" ? (
              <>
                <Table.Cell>{formatDynamicDate(project.updateAt)}</Table.Cell>
                <Table.Cell>{project.deletedYn}</Table.Cell>
                <Table.Cell
                  onClick={(event) => event.stopPropagation()}
                ></Table.Cell>
              </>
            ) : (
              <></>
            )}
          </>
        )}
        handleRowClick={handleRowClick}
        isClickable={(project) => project.clickable === 1}
        placeholderHeight="300px" // 자리 표시자 높이
      />  */}
    </>
  );
}
