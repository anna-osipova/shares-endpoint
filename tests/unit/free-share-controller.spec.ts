import { DEFAULT_RANGE_VALUES, getRandomRange } from "../../app/utils";
import { mocked } from "jest-mock";
import { Broker } from "../../app/broker-api";
import { RewardRange } from "../../app/types";
import { claimFreeShare } from "../../app/free-share-controller";

jest.mock("../../app/utils", () => ({
  ...(jest.requireActual("../../app/utils") as any),
  getRandomRange: jest.fn(),
}));

let isMarketOpenSpy;

describe("claimFreeShare", () => {
  beforeEach(() => {
    isMarketOpenSpy = jest
      .spyOn(Broker.prototype, "isMarketOpen")
      .mockResolvedValue({
        open: true,
        nextOpeningTime: "",
        nextClosingTime: "",
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("when a reward range is drafted", () => {
    beforeEach(() => {
      mocked(getRandomRange).mockImplementation(() => RewardRange.UPPER);
    });

    it("returns share within reward range", async () => {
      const result = await claimFreeShare();
      expect(result.sharePrice).toBeGreaterThanOrEqual(
        DEFAULT_RANGE_VALUES.UPPER_RANGE_MIN
      );
      expect(result.sharePrice).toBeLessThanOrEqual(
        DEFAULT_RANGE_VALUES.UPPER_RANGE_MAX
      );
    });

    it("checks market status", async () => {
      await claimFreeShare();

      expect(isMarketOpenSpy).toHaveBeenCalledTimes(1);
    });

    it("buys asset", async () => {
      const buySpy = jest.spyOn(Broker.prototype, "buySharesInRewardsAccount");
      await claimFreeShare();

      expect(buySpy).toHaveBeenCalledTimes(1);
    });

    it("transfer asset into user's account", async () => {
      const buySpy = jest.spyOn(
        Broker.prototype,
        "moveSharesFromRewardsAccount"
      );
      await claimFreeShare();

      expect(buySpy).toHaveBeenCalledTimes(1);
    });
  });
});
