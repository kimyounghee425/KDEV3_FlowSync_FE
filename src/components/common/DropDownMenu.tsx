// 수정, 삭제 버튼을 띄우는 드롭다운 버튼.
// 각종 게시글들, 댓글에 사용 가능
import { MenuItem, Button, Image } from "@chakra-ui/react";
import { MenuContent, MenuRoot, MenuTrigger } from "@/src/components/ui/menu";

export default function DropDownMenu({onEdit, onDelete}: any) { // 타입 선언?
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          backgroundColor="white"
          _hover={{ backgroundColor: "gray.200" }}
        >
          <Image width="15px" src="/아이콘.png" alt="수정삭제 아이콘" />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="수정" onClick={onEdit}>수정</MenuItem>
        <MenuItem
          value="삭제"
          color="fg.error"
          _hover={{ bg: "bg.error", color: "fg.error" }}
          onClick={onDelete}
        >
          삭제
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
