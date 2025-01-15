import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";
import { useProjectsData } from "@/src/context/ProjectsContext";
import { ListCollection } from "@chakra-ui/react";

interface SelectBoxProps {
  frameworks: ListCollection<{ label: string; value: string }>;
}

const SelectBox: React.FC<SelectBoxProps> = ({ frameworks }) => {
  const { filter, setFilter } = useProjectsData();

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
};

export default SelectBox;
