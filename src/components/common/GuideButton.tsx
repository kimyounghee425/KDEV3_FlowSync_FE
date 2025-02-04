import {
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { MessageCircleWarning } from "lucide-react";

interface GuideButtonProps {
  label?: string; // 버튼 텍스트
  guideText: string; // 팝업에 표시될 가이드 텍스트
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  }; // 버튼 위치 커스터마이징
}

export default function GuideButton({
  label = "도움말", // 기본 텍스트
  guideText = "* 이 페이지는 추후 개발 진행 예정입니다. 참고 부탁드립니다.",
  position = { top: "1%", right: "50%" }, // 기본 위치
}: GuideButtonProps) {
  return (
    <>
      <PopoverRoot>
        <PopoverTrigger asChild>
          <Button
            position="fixed"
            {...position} // 위치 설정
            backgroundColor="#007bff"
            color="white"
            padding="10px 16px"
            borderRadius="8px"
            fontSize="14px"
            fontWeight="bold"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            _hover={{ backgroundColor: "#0056b3" }}
            zIndex={100}
          >
            <MessageCircleWarning />
          </Button>
        </PopoverTrigger>
        <PopoverContent bg="lightblue" borderRadius="md">
          <PopoverArrow />
          <PopoverBody>
            <PopoverTitle fontWeight="medium">
              <strong>이용 가이드</strong>
            </PopoverTitle>
            <Text fontSize="sm" color="gray.700" whiteSpace="pre-line">
              {guideText}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </>
  );
}
