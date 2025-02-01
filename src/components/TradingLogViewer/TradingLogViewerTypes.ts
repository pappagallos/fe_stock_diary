import { ITradingLog, ITradingLogDeleteData } from "@/app/types";

export interface ITradingLogViewerProps {
  diaryId: number | null;
  tradingLog: ITradingLog | null;
  onDelete: ({ useLoading }: ITradingLogDeleteData) => void;
}

export interface IDiaryAsset {
  id: number;
  diary_id: number;
  asset_id: number;
  ticker: string;
  amount: string;
  buy_price: string;
  created_at: string;
  updated_at: string;
}

export interface IStatus {
  isPendingForFetch: boolean;
  isPendingForDelete: boolean;
  isPendingForUpdate: boolean;
}

export interface IDiaryAssetInitData {
  useLoading: boolean;
}

export interface IDiaryAssetDeleteData {
  useLoading: boolean;
}
