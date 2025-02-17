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
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // 링크 추가
  const handleAddLink = async () => {
    if (!newLink || !newLinkName) {
      alert("링크와 이름을 입력하세요.");
      return;
    }

    setIsChecking(true);
    const isValid = await checkURLExists(newLink);
    setIsChecking(false);

    if (!isValid) {
      alert("존재하지 않은 URL입니다.");
      return;
    }

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

  const checkURLExists = async (url: string) => {
    try {
      const formattedURL =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;

      new URL(formattedURL);

      const response = await fetch(formattedURL, {
        method: "HEAD",
        mode: "no-cors",
      });

      if (response && response.type === "opaque") {
        return true;
      }
      return response.ok;
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        return false;
      }
      return false;
    }
  };

  // checkURLExists("na22ver.com");

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
        <Button
          color="white"
          bg="blue.500"
          _hover={{ bg: "blue.600" }}
          loading={isChecking}
          onClick={handleAddLink}
        >
          추가
        </Button>
      </Flex>
    </Box>
  );
}
