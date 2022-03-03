import { Broker } from "./broker-api";
import { getMinMaxFromRange, getRandomRange } from "./utils";
import { AssetWithPrice, RewardBounds } from "./types";

export class MarketClosedError extends Error {
  constructor(args) {
    super(args);
    Object.setPrototypeOf(this, MarketClosedError.prototype);
  }
}

const buyAsset = async (broker: Broker, asset: AssetWithPrice) => {
  const result = await broker.buySharesInRewardsAccount(asset.tickerSymbol, 1);
  if (result.success) {
    return asset;
  }
  throw new Error("Failed to buy shares");
};

const getAssetsWithPrices = async (
  broker: Broker
): Promise<AssetWithPrice[]> => {
  const assets = await broker.listTradableAssets();
  const assetsWithPrices = await Promise.all(
    assets.map(async ({ tickerSymbol }) => {
      try {
        const { sharePrice } = await broker.getLatestPrice(tickerSymbol);
        return {
          tickerSymbol,
          sharePrice,
        };
      } catch (err) {
        console.error(err);
        return {
          tickerSymbol,
          sharePrice: null,
        };
      }
    })
  );
  return assetsWithPrices;
};

const findShareWithinBounds = (bounds) => (asset: AssetWithPrice) => {
  const { sharePrice } = asset;
  return sharePrice && sharePrice >= bounds.min && sharePrice <= bounds.max;
};

const chooseRewardAsset = async (
  broker: Broker,
  bounds: RewardBounds
): Promise<AssetWithPrice> => {
  const existingAssets = await broker.getRewardsAccountPositions();
  const matchingExistingAssets = existingAssets.filter(
    findShareWithinBounds(bounds)
  );
  if (matchingExistingAssets.length > 0) {
    return matchingExistingAssets[
      Math.floor(Math.random() * matchingExistingAssets.length)
    ];
  }
  const assetsWithPrices = await getAssetsWithPrices(broker);

  const validAssets = assetsWithPrices.filter(findShareWithinBounds(bounds));
  if (validAssets.length === 0) {
    throw new Error("No valid assets");
  }
  return validAssets[Math.floor(Math.random() * validAssets.length)];
};

const transferAsset = async (
  broker: Broker,
  asset: AssetWithPrice,
  targetAccount: string
): Promise<void> => {
  const result = await broker.moveSharesFromRewardsAccount(
    targetAccount,
    asset.tickerSymbol,
    1
  );
  if (result.success) {
    return;
  }

  throw new Error("Failed to transfer asset");
};

const checkMarketStatus = async (broker: Broker) => {
  const marketStatus = await broker.isMarketOpen();
  if (!marketStatus.open) {
    throw new MarketClosedError(
      `Market is currently closed. Come back at ${marketStatus.nextOpeningTime}`
    );
  }
};

export const claimFreeShare = async () => {
  // Normally we would get this out of user session
  const TARGET_ACCOUNT_ID = "TARGET_ACCOUNT_ID";

  const range = getRandomRange();
  const bounds = getMinMaxFromRange(range);

  const broker = new Broker();
  await checkMarketStatus(broker);

  const asset = await chooseRewardAsset(broker, bounds);
  await buyAsset(broker, asset);
  await transferAsset(broker, asset, TARGET_ACCOUNT_ID);

  return {
    userMessage: `Congratulations! Your reward is ${asset.tickerSymbol} worth ${asset.sharePrice}$!`,
    tickerSymbol: asset.tickerSymbol,
    sharePrice: asset.sharePrice,
  };
};
