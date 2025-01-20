"use client";

import { ReactNode } from "react";
import { Table } from "@chakra-ui/react";
import { SkeletonText } from "@/src/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { MemberProps } from "@/src/types/member";

// interface Member {
//   [members: string]: MemberProps; // 추가 필드가 있을 경우를 위해 설정
// }

interface MemberTableProps {
  headerTitle: ReactNode;
  memberList: MemberProps[]; // `Member` 타입 사용
  loading: boolean;
  renderRow: (item: MemberProps) => ReactNode; // `Member` 타입 사용
}

const MemberTable = ({ headerTitle, memberList, loading, renderRow }: MemberTableProps) => {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/admins/members/${id}`);
  };

  console.log("memberList는 과연", memberList);
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
        ) : (
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
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default MemberTable;
