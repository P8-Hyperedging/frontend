import { serveFile } from "@std/http/file-server";
import { exists } from "@std/fs";
import { getValue, hasValue } from "./optional.ts";
import { Router, UrlMethod } from "./router.ts";
import {
  home_page,
  parameter_form,
  running_jobs_page,
} from "./routes.ts";
import { Logger } from "@deno-library/logger";
import post_train from "./services/train_service.ts";
import { NoPageResponse } from "./components/responses.tsx";
import { render_schema } from "./pages/schema.tsx";
import { train_a_model_page } from "./pages/train.tsx";
import { results_page } from "./pages/results.tsx";

const router = new Router();
const logger = new Logger();

router.registerPage("/schema", render_schema);
router.registerPage("/train", train_a_model_page);
router.registerPage("/results", results_page);
router.registerGetRoute("/parameter-form", parameter_form);
router.registerPostRoute("/train", post_train);
router.registerGetRoute("/running-jobs", running_jobs_page);
router.registerGetRoute("/", home_page);

Deno.serve(async (req) => {
  const url = new URL(req.url);
  logger.debug(req.method + " " + url.pathname);
  const pathname = url.pathname;

  const res = await router.route(pathname, req, req.method as UrlMethod);
  if (hasValue(res)) {
    return getValue(res);
  }

  const filePath = pathname === "/" ? "/index.html" : pathname;
  const fullPath = `./public${filePath}`;

  if (await exists(fullPath)) {
    return await serveFile(req, fullPath);
  }

  return NoPageResponse(pathname);
});
