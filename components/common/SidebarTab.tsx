import { Box, Card, For, Stack } from "@chakra-ui/react";
import Data from "@/data/projects_mock_data.json";
import Link from "next/link";

export default function SidebarTab({ props }) {
  const list = Data.filter(Data => (props === "완료 프로젝트" ? Data.progressStage === "완료" : Data.progressStage === "진행 중"))
    .slice(0, 5)
    .map(item => {
      return (
        <Card.Title mb="2" key={item.id}>
          <Link href="/projects/project">{item.projectName}</Link>
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
