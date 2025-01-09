import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";
import { useFilter } from "@/src/context/ProjectsFilterContext";
import { ListCollection } from "@chakra-ui/react";

interface SelectBoxProps {
  frameworks: ListCollection<{ label: string; value: string }>;
}

export const SelectBox: React.FC<SelectBoxProps> = ({ frameworks }) => {
  const { filter, setFilter } = useFilter();

  const handleValueChange = (details: { value: string[] }) => {
    const selectedValue = details.value[0]; // 선택된 첫 번째 값
    if (setFilter && selectedValue) {
      setFilter(selectedValue);
    }
  };

  return (
    <SelectRoot
      collection={frameworks}
      size="md"
      width="110px"
      value={[filter]}
      onValueChange={handleValueChange}
    >
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
};
