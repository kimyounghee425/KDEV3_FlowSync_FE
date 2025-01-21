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

export default function BoardCategorySelectBox() {
  const router = useRouter();
  const { boardCategory } = useProjectBoard();

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
      collection={boardCategoryFramework}
      size="md"
      width="110px"
      value={[boardCategory]}
      onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValueText></SelectValueText>
      </SelectTrigger>
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
