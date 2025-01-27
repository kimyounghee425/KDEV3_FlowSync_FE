interface OrganizationProps {
  id: number;
  type: string;
  name: string;
  status: string;
}

interface SelectOrganizationSectionProps {
  onSelect: (selected: { id: number; type: string }) => void;
}

export default function SelectOrganizationSection({
  onSelect,
}: SelectOrganizationSectionProps) {


    
  return <div></div>;
}
