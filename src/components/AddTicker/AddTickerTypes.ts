import { IAddDiaryAsset } from "../AddTradingLogForm/AddTradingLogFormTypes";

export interface IAddTickerProps {
  assets: IAddDiaryAsset[];
  onChangeAsset: (
    index: number,
    key: keyof IAddDiaryAsset,
    value: string
  ) => void;
  onClickAddAsset: () => void;
  isPending?: boolean;
  isDisabled?: boolean;
  style?: React.CSSProperties;
}

