import { get_client } from "./database_service.ts";
import { Job, State } from "../../shared/job.ts";
import { Parameter } from "../../shared/input_types.ts";

function row_to_job(row: any): Job {
    return new Job({
        id: row.id,
        title: row.title,
        description: row.description,
        started: row.started,
        finished: row.finished,
        duration: row.duration,
        state: row.state,
        parameters: [
            { name: "model", value: row.model_name },
            { name: "num_epochs", value: row.epochs },
            { name: "lr", value: row.learning_rate },
            { name: "hidden_layer_size", value: row.hidden_layer_size },
            { name: "train_proportion", value: row.train_proportion },
            { name: "dropout", value: row.dropout },
            { name: "weight_decay", value: row.weight_decay }
        ]
    });
}

function parameters_to_object(params: Parameter[]): Record<string, any> {
    return Object.fromEntries(params.map(p => [p.name, p.value]));
}

export async function get_all_jobs(): Promise<Job[]> {
    const client = await get_client();

    const result = await client.queryObject(`
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
            "state",
            "model_name"
        FROM "jobs";
    `);

    return result.rows.map(row_to_job);
}

export async function get_first_pending_job(): Promise<Job | null> {
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
            "state",
            "model_name"
        FROM "jobs" AS j
        WHERE j.state = $1
        ORDER BY j.id
        LIMIT 1;
        `,
        [State.PENDING]
    );

    return result.rows.length ? row_to_job(result.rows[0]) : null;
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
        query += `, "finished" = NOW(), "duration" = EXTRACT(EPOCH FROM (NOW() - "started"))`;
    }

    query += ` WHERE "id" = $2`;
    params.push(job.id);

    await client.queryObject(query, params);
}

export async function run_job(job: Job): Promise<void> {
    try {
        await mark_job(job, State.RUNNING);

        const paramsObj = parameters_to_object(job.parameters);
        const model = paramsObj.model;

        if (!model) {
            throw new Error("Missing model parameter");
        }

        delete paramsObj.model;

        const response = await fetch(`http://127.0.0.1:5002/train/${model}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paramsObj)
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const resp = await response.json();
        console.log(resp);

        await mark_job(job, State.DONE);
    } catch (err) {
        console.error("Job failed:", err);
        await mark_job(job, State.FAILED);
    }
}