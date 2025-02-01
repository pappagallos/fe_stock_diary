export interface IDiaryAssetProps {
  assetId: number;
  assetName: string;
  purchasePrice: number;
  currentPrice: number;
  profitRate: number;
  onDelete: () => void;
}
