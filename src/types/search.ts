export interface SearchSectionProps {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: () => void;
  reset: () => void;
}