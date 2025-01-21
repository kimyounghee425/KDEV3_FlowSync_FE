import { useRouter } from "next/navigation";
import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";
import { useProjectBoard } from "@/src/hook/useProjectBoard";

const boardCategoryFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "질문", value: "QUESTION" },
    { label: "요청", value: "REQUEST" },
    { label: "답변", value: "ANSWER" },
  ],
});

/**
 * BoardCategorySelectBox 컴포넌트:
 *  - 게시글 유형(카테고리)을 선택할 수 있는 드롭다운.
 *  - 선택값이 변경되면 쿼리 파라미터(boardCategory)를 업데이트하여 URL을 갱신하고,
 *    이를 통해 필터 기능을 구현함.
 */
export default function BoardCategorySelectBox() {
  const router = useRouter();
  const { boardCategory } = useProjectBoard();

  /**
   * 셀렉트 박스의 값이 변경될 때 호출되는 핸들러.
   * @param details { value: string[] }
   *   - 사용자 선택이 배열 형태로 반환됨.
   *   - 여기서는 첫 번째 값만 사용해 URL 파라미터를 갱신.
   */
  const handleValueChange = (details: { value: string[] }) => {
    const selectedValue = details.value[0]; // 선택된 첫 번째 값
    const params = new URLSearchParams(window.location.search);

    if (selectedValue) {
      params.set("boardCategory", selectedValue); // 필터값 설정
    } else {
      params.delete("boardCategory"); // 필터값 제거
    }

    router.push(`?${params.toString()}`); // URL 업데이트
  };

  return (
    <SelectRoot
      // 미리 정의한 boardCategoryFramework (전체, 질문, 요청, 답변) 옵션
      collection={boardCategoryFramework}
      size="md"
      width="110px"
      value={[boardCategory]}
      onValueChange={handleValueChange}
    >
      {/* 드롭다운 트리거(버튼) 영역 */}
      <SelectTrigger>
        {/* 현재 선택된 값 표시 영역 */}
        <SelectValueText></SelectValueText>
      </SelectTrigger>
      {/* 드롭다운 펼쳤을 때의 옵션 목록 */}
      <SelectContent>
        {boardCategoryFramework.items.map((status) => (
          <SelectItem item={status} key={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
