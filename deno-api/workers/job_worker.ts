import {get_first_pending_job, run_job} from "../services/job_service.ts";

export async function runJobsAsync(): Promise<void> {
    while (true) {
        const job = await get_first_pending_job();

        if (!job) {
            await sleep(1000);
            continue;
        }

        await run_job(job);
    }
}

// helper
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}