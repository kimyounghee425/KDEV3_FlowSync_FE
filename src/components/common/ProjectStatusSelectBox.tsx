import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";
import { useProjectList } from "@/src/hook/useProjectList";
import { createListCollection } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const projectStatus = createListCollection<{ label: string; value: string }>({
  items: [
    { label: "전체", value: "" },
    { label: "진행중", value: "IN_PROGRESS" },
    { label: "납품완료", value: "COMPLETED" },
    { label: "일시중단", value: "PAUSED" },
  ],
});

export default function ProjectStatusSelectBox() {
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
      collection={projectStatus}
      size="md"
      width="110px"
      value={[filter]}
      onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValueText></SelectValueText>
      </SelectTrigger>
      <SelectContent>
        {projectStatus.items.map((status) => (
          <SelectItem item={status} key={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
