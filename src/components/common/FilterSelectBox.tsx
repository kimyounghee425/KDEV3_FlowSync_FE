import { useRouter } from "next/navigation";
import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";

interface StatusSelectBoxProps {
  statusFramework: ReturnType<typeof createListCollection>;
  selectedValue: string | undefined;
  queryKey: string;
  placeholder: string;
  width?: string;
}

/**
 * BoardStatusSelectBox 컴포넌트:
 *   - 게시글/업무 상태를 선택(필터링)하기 위한 드롭다운 UI.
 *   - 상태가 바뀔 때, URL 쿼리 파라미터를 업데이트하여 필터로 사용한다.
 */
export default function FilterSelectBox({
  statusFramework,
  selectedValue,
  queryKey,
  placeholder,
  width = "150px",
}: StatusSelectBoxProps) {
  const router = useRouter();

  /**
   * 드롭다운 선택이 바뀔 때 실행될 콜백:
   *   - 선택된 값을 읽어와 쿼리 파라미터(boardStatus)를 설정/삭제 후 라우팅
   */
  const handleValueChange = (details: { value: string[] }) => {
    // Chakra Select 컴포넌트는 배열 형태로 값을 제공하므로, 첫 번째 값만 추출
    const newValue = details.value[0];

    // 현재 선택된 값과 동일하면 함수 실행 종료
    if (newValue === selectedValue) {
      return;
    }

    // 현재 URL의 쿼리 파라미터를 파싱
    const params = new URLSearchParams(window.location.search);

    if (newValue) {
      // 선택된 상태 값이 있으면, boardStatus 파라미터로 설정
      params.set(queryKey, newValue);
    } else {
      // "전체"를 선택하면, 파라미터 삭제
      params.delete(queryKey); // 필터값 제거
    }
    params.set("currentPage", "1");
    // 변경된 쿼리 파라미터를 포함한 새 URL로 이동
    router.push(`?${params.toString()}`);
  };

  return (
    <SelectRoot
      collection={statusFramework}
      size="md"
      width={width}
      value={selectedValue ? [selectedValue] : []}
      onValueChange={handleValueChange}
    >
      {/* 드롭다운 버튼(트리거) */}
      <SelectTrigger
        _hover={{
          backgroundColor: "#6c757d",
        }}
      >
        {/* 선택된 값이 표시될 영역 */}
        <SelectValueText
          textAlign="center"
          width="100%"
          placeholder={placeholder}
        />
      </SelectTrigger>

      {/* 드롭다운 펼쳤을 때의 옵션 목록 */}
      <SelectContent>
        {(
          statusFramework.items as {
            id: string;
            label: string;
            value: string;
          }[]
        ).map((item) => (
          <SelectItem item={item} key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
