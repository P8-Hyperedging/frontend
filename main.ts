import { serveFile } from "@std/http/file-server";
import { exists } from "@std/fs";
import { getValue, hasValue } from "./optional.ts";
import { NoPageResponse } from "./reponses.ts";
import { Router } from "./router.ts";
import { home_page, paramter_form, schema, train_a_model_page } from "./routes.ts";

const router = new Router();

router.registerGetRoute("/schema", schema)
router.registerGetRoute("/parameter-form", paramter_form)
router.registerGetRoute("/train", train_a_model_page)
router.registerGetRoute("/", home_page)

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const res = await router.route(pathname, url, req.method);
  if(hasValue(res)) {
    return getValue(res);
  }

  const filePath = pathname === "/" ? "/index.html" : pathname;
  const fullPath = `./public${filePath}`;

  if (await exists(fullPath)) {
    return await serveFile(req, fullPath);
  }

  return NoPageResponse(pathname)
  }
);
