import { ITradingLogCreateData } from "@/app/types";

export interface IAddDiaryAsset {
  asset_id: number | null;
  ticker: string;
  amount: string;
  buy_price: string;
}

export interface IAddTradingLogForm {
  title: string;
  contents: string;
  date: string;
  assets: IAddDiaryAsset[];
}

export interface IAddTradingLogFormProps {
  onCreate: ({ useLoading }: ITradingLogCreateData) => void;
}