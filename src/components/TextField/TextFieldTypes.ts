export interface ITextFieldChangeData {
  isValidFormat: boolean;
  value: string;
}

export interface ITextFieldProps {
  value: string; // 기본 입력 값
  type?: "text" | "password"; // 텍스트 필드 타입
  label?: string; // 라벨
  textAlign?: "left" | "center" | "right"; // 텍스트 정렬
  placeholder?: string; // 플레이스홀더
  checkFormatRegex?: string; // 입력 검증 정규식
  checkFormatter?: (value: string) => boolean; // 입력 검증 함수
  autoCompletionList?: string[]; // 자동완성 목록
  onChange: (params: ITextFieldChangeData) => void; // 입력 변경 이벤트
  isDisabled?: boolean; // 입력 비활성 여부
  style?: React.CSSProperties; // 스타일
}