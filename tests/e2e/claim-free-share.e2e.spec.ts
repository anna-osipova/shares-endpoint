import server from "../../app/server";
import supertest from "supertest";
import { Broker } from "../../app/broker-api";

describe("GET /claim-free-share", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("when market is open", () => {
    beforeEach(() => {
      jest.spyOn(Broker.prototype, "isMarketOpen").mockResolvedValue({
        open: true,
        nextOpeningTime: "",
        nextClosingTime: "",
      });
    });

    it("should return 200", async () => {
      const response = await supertest(server.callback()).get(
        "/claim-free-share"
      );
      expect(response.status).toBe(200);
    });

    it("should return user message", async () => {
      const response = await supertest(server.callback()).get(
        "/claim-free-share"
      );
      expect(response.body.userMessage).toMatch(
        "Congratulations! Your reward is"
      );
    });

    it("should return asset", async () => {
      const response = await supertest(server.callback()).get(
        "/claim-free-share"
      );
      expect(response.body.tickerSymbol).toEqual(expect.any(String));
      expect(response.body.sharePrice).toEqual(expect.any(Number));
    });
  });

  describe("when market is closed", () => {
    const openingDate = new Date(2024, 1, 1);
    beforeEach(() => {
      jest.spyOn(Broker.prototype, "isMarketOpen").mockResolvedValue({
        open: false,
        nextOpeningTime: openingDate.toUTCString(),
        nextClosingTime: "",
      });
    });

    it("should return 403", async () => {
      const response = await supertest(server.callback()).get(
        "/claim-free-share"
      );
      expect(response.status).toBe(403);
    });

    it("should return error with timestamp", async () => {
      const response = await supertest(server.callback()).get(
        "/claim-free-share"
      );
      expect(response.body.userMessage).toMatch(openingDate.toUTCString());
    });
  });
});
