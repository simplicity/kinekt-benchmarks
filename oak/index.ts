import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { range } from "../range.ts";

const app = new Application();
const router = new Router();

range.forEach((index1) => {
  range.forEach((index2) => {
    router.post(`/${index1}/${index2}`, async (ctx: Context) => {
      const body = await ctx.request.body.json();
      ctx.response.status = 201;
      ctx.response.body = body;
    });
  });
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 3001;
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
