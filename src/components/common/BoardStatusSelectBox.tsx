import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";
import { useProjectBoard } from "@/src/hook/useProjectBoard";
import { createListCollection } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const boardStatusFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "진행중", value: "PROGRESS" },
    { label: "완료", value: "COMPLETED" },
    { label: "보류", value: "SUSPENSION" },
    { label: "승인요청", value: "PERMISSION_REQUEST" },
  ],
});

export default function BoardStatusSelectBox() {
  const router = useRouter();
  const { boardStatus } = useProjectBoard();

  const handleValueChange = (details: { value: string[] }) => {
    const selectedValue = details.value[0]; // 선택된 첫 번째 값
    const params = new URLSearchParams(window.location.search);

    if (selectedValue) {
      params.set("filter", selectedValue); // 필터값 설정
    } else {
      params.delete("filter"); // 필터값 제거
    }

    router.push(`?${params.toString()}`); // URL 업데이트
  };

  return (
    <SelectRoot
      collection={boardStatusFramework}
      size="md"
      width="110px"
      value={[boardStatus]}
      onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValueText></SelectValueText>
      </SelectTrigger>
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
