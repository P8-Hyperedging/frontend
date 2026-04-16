import {get_client} from "./database_service.ts";
import {Job, State} from "../../shared/job.ts";

export async function get_all_jobs(): Promise<Job[]> {
    const client = await get_client();

    const result = await client.queryObject(
        `
            SELECT
                "id",
                "title",
                "description",
                "hidden_layer_size",
                "learning_rate",
                "weight_decay",
                "epochs",
                "train_proportion",
                "dropout",
                "started",
                "finished",
                "duration",
                "state"
            FROM "jobs";
        `
    );

    const jobs = result.rows as Job[];
    return jobs;
}

export async function get_first_pending_job(): Promise<Job | null> {
    const client = await get_client();

    const result = await client.queryObject<Job>(
        `
            SELECT
                "id",
                "title",
                "description",
                "hidden_layer_size",
                "learning_rate",
                "weight_decay",
                "epochs",
                "train_proportion",
                "dropout",
                "started",
                "finished",
                "duration",
                "state"
            FROM "jobs" AS j
            WHERE j.state = $1
            ORDER BY j.id
                LIMIT 1;
        `,
        [State.PENDING]
    );

    return result.rows[0] ?? null;
}

export async function mark_job(job: Job, state: State): Promise<void> {
    const client = await get_client();

    let query = `
        UPDATE "jobs"
        SET "state" = $1
    `;
    const params: any[] = [state];

    if (state === State.RUNNING) {
        query += `, "started" = NOW()`;
    }

    if (state === State.DONE || state === State.FAILED) {
        query += `, "finished" = NOW(), "duration" = NOW() - "started"`;
    }

    query += ` WHERE "id" = $2`;
    params.push(job.id);

    await client.queryObject(query, params);
}

export async function run_job(job: Job): Promise<void> {
    
}