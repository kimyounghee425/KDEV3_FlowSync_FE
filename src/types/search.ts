export interface SearchSectionProps {
  input: string;
  setQuery: (value: string) => void;
  setInput: (value: string) => void;
  onSubmit: () => void;
  reset: () => void;
}