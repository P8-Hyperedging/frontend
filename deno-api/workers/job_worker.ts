import {get_all_jobs, get_first_pending_job} from "../services/job_service.ts";
import {State} from "../../shared/job.ts";

export async function runJobsAsync(): Promise<void> {
    while (true) {
        const job = await get_first_pending_job();

        if (!job) {
            await sleep(1000);
            continue;
        }

        try {
            await markJobAsRunning(job.id);

            // This should resolve when the job is finished
            await processJob(job);

            await markJobAsCompleted(job.id);
        } catch (err) {
            await markJobAsFailed(job.id, err);
        }
    }
}

// helper
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}