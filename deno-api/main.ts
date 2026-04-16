import { serveFile } from "@std/http/file-server";
import { exists } from "@std/fs";
import { getValue, hasValue } from "./optional.ts";
import { Router, UrlMethod } from "./router.ts";
import { Logger } from "@deno-library/logger";
import post_train from "./services/train_service.ts";
import { get_database_schema } from "./services/schema_service.ts";
import {
  get_model_names,
  get_model_outputs,
  get_parameters,
} from "./services/model_output_service.ts";
import { NotFound } from "./responses.ts";
import { WebSocketBridge } from "./services/websocket_bridge.ts";
import {get_all_jobs} from "./services/job_service.ts";

const router = new Router();
const logger = new Logger();
const wsBridge = new WebSocketBridge(logger);

router.registerGetRoute("/api/get-database-schema", get_database_schema);
router.registerGetRoute("/api/get-model-outputs", get_model_outputs);
router.registerGetRoute("/api/jobs", get_all_jobs);
router.registerGetRoute("/api/get-parameters", get_parameters);
router.registerGetRoute("/api/get-model-names", get_model_names);
router.registerPostRoute("/api/train", post_train);

wsBridge.start();

Deno.serve(async (req) => {
  const url = new URL(req.url);
  logger.debug(req.method + " " + url.pathname);
  const pathname = url.pathname;

  if (pathname === "/ws" && req.headers.get("upgrade") === "websocket") {
    return wsBridge.handleFrontendUpgrade(req);
  }

  const res = await router.route(pathname, req, req.method as UrlMethod);
  if (hasValue(res)) {
    return getValue(res);
  }

  const filePath = pathname === "/" ? "/index.html" : pathname;
  const fullPath = `./public${filePath}`;

  if (await exists(fullPath)) {
    return await serveFile(req, fullPath);
  }

  return NotFound(`Failed to find: ${pathname}`);
});
