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

const boardStatusFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "진행중", value: "INPROGRESS" },
    { label: "완료", value: "COMPLETED" },
    { label: "보류", value: "SUSPENSION" },
    { label: "승인요청", value: "PERMISSION_REQUEST" },
  ],
});

/**
 * BoardStatusSelectBox 컴포넌트:
 *   - 게시글/업무 상태를 선택(필터링)하기 위한 드롭다운 UI.
 *   - 상태가 바뀔 때, URL 쿼리 파라미터를 업데이트하여 필터로 사용한다.
 */
export default function BoardStatusSelectBox() {
  const router = useRouter();
  const { boardStatus } = useProjectBoard();

  /**
   * 드롭다운 선택이 바뀔 때 실행될 콜백:
   *   - 선택된 값을 읽어와 쿼리 파라미터(boardStatus)를 설정/삭제 후 라우팅
   */
  const handleValueChange = (details: { value: string[] }) => {
    // Chakra Select 컴포넌트는 배열 형태로 값을 제공하므로, 첫 번째 값만 추출
    const selectedValue = details.value[0];
    // 현재 URL의 쿼리 파라미터를 파싱
    const params = new URLSearchParams(window.location.search);

    if (selectedValue) {
      // 선택된 상태 값이 있으면, boardStatus 파라미터로 설정
      params.set("boardStatus", selectedValue);
    } else {
      // "전체"를 선택하면, 파라미터 삭제
      params.delete("boardStatus"); // 필터값 제거
    }

    // 변경된 쿼리 파라미터를 포함한 새 URL로 이동
    router.push(`?${params.toString()}`);
  };

  return (
    <SelectRoot
      collection={boardStatusFramework}
      size="md"
      width="110px"
      value={[boardStatus]}
      onValueChange={handleValueChange}
    >
      {/* 드롭다운 버튼(트리거) */}
      <SelectTrigger>
        {/* 선택된 값이 표시될 영역 */}
        <SelectValueText />
      </SelectTrigger>

      {/* 드롭다운 펼쳤을 때의 옵션 목록 */}
      <SelectContent>
        {boardStatusFramework.items.map((status) => (
          <SelectItem item={status} key={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
