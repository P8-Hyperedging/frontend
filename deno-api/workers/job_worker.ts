import { get_first_pending_job, run_job } from "../services/job_service.ts";
import { getValue, hasValue } from "../optional.ts";
import { WebSocketBridge } from "../services/websocket_bridge.ts";

export async function runJobsAsync(wsBridge: WebSocketBridge): Promise<void> {
  while (true) {
    const job = await get_first_pending_job();

    if (!wsBridge.isPythonAlive()) {
      await sleep(1000);
      continue;
    }

    if (!hasValue(job)) {
      await sleep(1000);
      continue;
    }

    await run_job(getValue(job));
  }
}

// helper
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
