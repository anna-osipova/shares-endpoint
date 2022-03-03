import { LATEST_PRICES, TICKER_SYMBOLS } from "./mock-data";

export class Broker {
  public listTradableAssets(): Promise<Array<{ tickerSymbol: string }>> {
    const data = TICKER_SYMBOLS.map((tickerSymbol) => ({ tickerSymbol }));
    return Promise.resolve(data);
  }

  public getLatestPrice(tickerSymbol: string): Promise<{ sharePrice: number }> {
    const data = { sharePrice: LATEST_PRICES[tickerSymbol] ?? 0 };
    return Promise.resolve(data);
  }

  public isMarketOpen(): Promise<{
    open: boolean;
    nextOpeningTime: string;
    nextClosingTime: string;
  }> {
    const timeStamp = new Date(2042, 1, 1).toUTCString();
    // Random value for if market is open or not
    const open = Math.random() > 0.3;
    if (open) {
      return Promise.resolve({
        open: true,
        nextOpeningTime: "",
        nextClosingTime: timeStamp,
      });
    }
    return Promise.resolve({
      open: false,
      nextOpeningTime: timeStamp,
      nextClosingTime: "",
    });
  }

  public buySharesInRewardsAccount(
    tickerSymbol: string,
    quantity: number
  ): Promise<{ success: boolean; sharePricePaid: number }> {
    const data = {
      success: true,
      sharePricePaid: LATEST_PRICES[tickerSymbol] ?? 1 * quantity,
    };
    return Promise.resolve(data);
  }

  public getRewardsAccountPositions(): Promise<
    Array<{
      tickerSymbol: string;
      quantity: number;
      sharePrice: number;
    }>
  > {
    const data = [{ tickerSymbol: "AAPL", quantity: 0, sharePrice: Infinity }];
    return Promise.resolve(data);
  }

  public moveSharesFromRewardsAccount(
    toAccount: string,
    tickerSymbol: string,
    quantity: number
  ): Promise<{ success: boolean }> {
    const data = { success: true };
    return Promise.resolve(data);
  }
}
