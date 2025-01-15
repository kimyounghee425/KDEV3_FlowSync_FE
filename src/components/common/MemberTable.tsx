"use client";

import { ReactNode } from "react";
import { Table } from "@chakra-ui/react";
import { SkeletonText } from "@/src/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Member {
  name: string;
  id: string;
  [key: string]: any; // 추가 필드가 있을 경우를 위해 설정
}

interface MemberTableProps {
  headerTitle: ReactNode;
  memberList: Member[]; // `Member` 타입 사용
  loading: boolean;
  renderRow: (item: Member) => ReactNode; // `Member` 타입 사용
}

const MemberTable = ({ headerTitle, memberList, loading, renderRow }: MemberTableProps) => {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/members/${id}`);
  };

  return (
    <Table.Root size="sm" interactive>
      <Table.Header>{headerTitle}</Table.Header>

      <Table.Body>
        {loading ? (
          <Table.Row>
            <Table.Cell colSpan={7} textAlign="center">
              <SkeletonText noOfLines={5} gap="4" />
            </Table.Cell>
          </Table.Row>
        ) : Array.isArray(memberList) && memberList.length > 0 ? (
          memberList.map(member => (
            <Table.Row
              key={member.id}
              onClick={() => handleRowClick(member.id)}
              css={{
                "& > td": {
                  textAlign: "center",
                  height: "55px",
                  fontSize: "md",
                  cursor: "pointer",
                },
              }}
            >
              {renderRow(member)}
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={7} textAlign="center">
              데이터가 없습니다.
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default MemberTable;
