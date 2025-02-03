import { useState } from "react";
import { Box, Text, Button, Flex, Input } from "@chakra-ui/react";
interface LinkProps {
  name: string;
  url: string;
}

interface LinkAddSectionProps {
  linkList: LinkProps[];
  setLinkList: React.Dispatch<React.SetStateAction<LinkProps[]>>;
}

export default function LinkAddSection({
  linkList,
  setLinkList,
}: LinkAddSectionProps) {
  const [newLink, setNewLink] = useState<string>("");
  const [newLinkName, setNewLinkName] = useState<string>("");

  // 링크 추가
  const handleAddLink = () => {
    if (newLink && newLinkName) {
      setLinkList((prev) => [...prev, { name: newLinkName, url: newLink }]);
    }
    setNewLink("");
    setNewLinkName("");
  };

  // 링크 삭제
  const handleRemoveLink = (index: number) => {
    const updatedLinks = linkList.filter((_, i) => i !== index);
    setLinkList(updatedLinks);
  };

  return (
    <Box mt={6}>
      <Text>링크 입력</Text>
      {linkList.map((link, index) => (
        <Flex key={index} mb={2}>
          <Text>
            {link.name} ({link.url})
          </Text>
          <Button
            ml={4}
            colorScheme={"red"}
            size={"sm"}
            onClick={() => handleRemoveLink(index)}
          >
            삭제
          </Button>
        </Flex>
      ))}

      <Flex gap={2} mt={4}>
        <Input
          placeholder="링크(URL)를 입력하세요"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <Input
          placeholder="링크 이름(별명)을 입력하세요"
          value={newLinkName}
          onChange={(e) => setNewLinkName(e.target.value)}
        />
        <Button colorScheme={"blue"} onClick={handleAddLink}>
          추가
        </Button>
      </Flex>
    </Box>
  );
}
