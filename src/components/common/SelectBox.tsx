import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";
import { useProjectList } from "@/src/hook/useProjectList";
import { createListCollection, ListCollection } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const frameworks = createListCollection<{ label: string; value: string }>({
  items: [
    { label: "전체", value: "" },
    // { label: "계약", value: "계약" },
    { label: "진행중", value: "IN_PROGRESS" },
    { label: "납품완료", value: "COMPLETED" },
    // { label: "하자보수", value: "하자보수" },
    { label: "일시중단", value: "PAUSED" },
    // { label: "삭제(관리자용)", value: "삭제(관리자용)" },
  ],
});

export default function SelectBox() {
  const router = useRouter();

  const { filter } = useProjectList();

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
      collection={frameworks}
      size="md"
      width="110px"
      value={[filter]}
      onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValueText></SelectValueText>
      </SelectTrigger>
      <SelectContent>
        {frameworks.items.map((status) => (
          <SelectItem item={status} key={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
