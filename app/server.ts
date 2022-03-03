import { claimFreeShare, MarketClosedError } from "./free-share-controller";

const Koa = require("koa");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

router.get("/claim-free-share", async (ctx) => {
  try {
    const result = await claimFreeShare();
    ctx.body = result;
    ctx.status = 200;
  } catch (err) {
    if (err instanceof MarketClosedError) {
      ctx.body = {
        userMessage: err.message,
      };
      ctx.status = 403;
    } else {
      ctx.body = {
        error: err.message,
      };
      ctx.status = 500;
    }
  }
});

app.use(router.routes()).use(router.allowedMethods());

export default app;
