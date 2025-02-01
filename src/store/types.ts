export interface MarketAsset {
  id: number;
  name: string;
  price: string;
  ticker: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export interface GlobalStore {
  marketAssets: MarketAsset[];
  setMarketAssets: (marketAssets: MarketAsset[]) => void;
}
