import { Card } from "@chakra-ui/react";
import Data from "@/src/data/projects_mock_data.json";
import Link from "next/link";

export default function SidebarTab({
  projectStatus,
}: {
  projectStatus: string;
}) {
  const list = Data.data
    .filter((item) =>
      projectStatus === "완료 프로젝트"
        ? item.projectStatus === "completed"
        : item.projectStatus === "inProgress"
    )
    .slice(0, 5)
    .map((item) => {
      return (
        <Card.Title mb="2" key={item.id}>
          <Link href={`/projects/${item.id}`}>{item.projectName}</Link>
          <hr />
        </Card.Title>
      );
    });
  return (
    <Card.Root width="100%" bg="gray.500" border="0px" color="white">
      <Card.Body>{list}</Card.Body>
    </Card.Root>
  );
}
