export interface IButtonProps {
  value: string;
  className?: "primary" | "secondary" | "danger" | "disabled" | "pending";
  isPending?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}