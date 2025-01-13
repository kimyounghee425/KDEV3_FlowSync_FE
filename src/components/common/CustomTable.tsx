import { Table } from "@chakra-ui/react";
import { Loading } from "./Loading";
import { CustomBox } from "./CustomBox";
import { getTranslatedStatus } from "@/src/utils/getTranslatedStatus";
import { memo, ReactNode } from "react";
import { ProjectProps } from "@/src/types";
import { useRouter } from "next/navigation";

interface CustomTalbleProps {
  headerTitle: ReactNode;
  loading: boolean;
  data: ProjectProps[];
}

const CustomTable: React.FC<CustomTalbleProps> = ({
  headerTitle,
  loading,
  data,
}) => {
  const router = useRouter();
  const handleRowClick = (id: number) => {
    router.push(`/projects/${id}`);
  };

  return (
    <Table.Root size="sm" interactive>
      <Table.Header>{headerTitle}</Table.Header>
      <Table.Body>
        {loading ? (
          <Table.Row>
            <Table.Cell colSpan={7} textAlign="center">
              <Loading />
            </Table.Cell>
          </Table.Row>
        ) : (
          data.map((item) => (
            <Table.Row
              key={item.id}
              onClick={() => handleRowClick(item.id)}
              css={{
                "& > td": {
                  textAlign: "center",
                  height: "55px",
                  fontSize: "md",
                  cursor: "pointer",
                },
              }}>
              <Table.Cell>{item.projectName}</Table.Cell>
              <Table.Cell>{item.client}</Table.Cell>
              <Table.Cell>{item.developer}</Table.Cell>
              <Table.Cell>
                <CustomBox>{getTranslatedStatus(item.projectStatus)}</CustomBox>
              </Table.Cell>
              <Table.Cell>{item.startAt}</Table.Cell>
              <Table.Cell textAlign="end">{item.closeAt}</Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default memo(CustomTable);
