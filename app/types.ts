export enum RewardRange {
  LOWER,
  MEDIUM,
  UPPER,
}

export type RewardBounds = {
  min: number;
  max: number;
};

export type AssetWithPrice = {
  tickerSymbol: string;
  sharePrice: number | null;
};
