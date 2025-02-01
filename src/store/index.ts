import { create } from "zustand";
import { GlobalStore, MarketAsset } from "./types";

export const useGlobalStore = create<GlobalStore>((set) => ({
  marketAssets: [],
  setMarketAssets: (marketAssets: MarketAsset[]) => set({ marketAssets }),
}))
