export interface IModalProps {
  width?: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}