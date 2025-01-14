import { Card } from "@chakra-ui/react";
import Data from "@/src/data/projects_mock_data.json";
import Link from "next/link";
import { useSidebar } from "@/src/context/SidebarContext";
import { Loading } from "./Loading";

export default function SidebarTab() {
  const { projectStatus } = useSidebar();

  const list = Data.data
    .filter((item) =>
      projectStatus === "완료 프로젝트"
        ? item.projectStatus === "납품완료"
        : item.projectStatus === "진행중"
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
    <Card.Root width="100%" bg="gray.200">
      <Card.Body>{list}</Card.Body>
    </Card.Root>
  );
}
