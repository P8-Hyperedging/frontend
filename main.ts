import { serveFile } from "@std/http/file-server";
import { exists } from "@std/fs";
import { getValue, hasValue } from "./optional.ts";
import { NoPageResponse, RedirectResponse } from "./reponses.ts";
import { Router } from "./router.ts";
import {
  home_page,
  parameter_form,
  results_page,
  running_jobs_page,
  schema,
  train_a_model_page,
} from "./routes.ts";
import { Logger } from "@deno-library/logger";
import post_train from "./services/train_service.ts";

const router = new Router();
const logger = new Logger();

router.registerGetRoute("/schema", schema);
router.registerGetRoute("/parameter-form", parameter_form);
router.registerPostRoute("/train/allset", post_train)
router.registerGetRoute("/running-jobs", running_jobs_page);
router.registerGetRoute("/train", train_a_model_page);
router.registerGetRoute("/results", results_page);
router.registerGetRoute("/", home_page);

Deno.serve(async (req) => {
  const url = new URL(req.url);
  logger.debug(req.method + " " + url.pathname)
  const pathname = url.pathname;

  const res = await router.route(pathname, req, req.method);
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
