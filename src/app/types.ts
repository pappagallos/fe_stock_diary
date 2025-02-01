export interface ITradingLog {
  contents: string;
  created_at: string;
  date: string;
  id: number;
  title: string;
  updated_at: string;
  url: string;
}

export interface IUserInfo {
  user_id: number;
  email: string;
}

export interface ITradingLogCreateData {
  useLoading: boolean;
}

export interface ITradingLogDeleteData {
  useLoading: boolean;
}

export interface IMyAssetDeleteData {
  useLoading: boolean;
}

export type InitTradingLogsData = ITradingLogCreateData | ITradingLogDeleteData | void;