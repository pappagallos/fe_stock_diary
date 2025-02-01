export interface ITextareaProps {
  value: string;
  label?: string;
  rows?: number;
  useResize?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}