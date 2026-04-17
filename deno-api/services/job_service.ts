import { get_client } from "./database_service.ts";
import { Job, State } from "../../shared/job.ts";
import { ModelOutput } from "../../shared/model_output.ts";
import { outputMetricsToDb } from "./model_output_service.ts";

function row_to_job(row): Job {
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
      { name: "weight_decay", value: row.weight_decay },
    ],
  });
}

export async function get_all_jobs(): Promise<Job[]> {
  const client = await get_client();

  const result = await client.queryObject(`
        SELECT
            *
        FROM "jobs";
    `);

  return result.rows.map(row_to_job);
}

export async function get_first_pending_job() {
  const client = await get_client();

  const result = await client.queryObject(
    `
    WITH next_job AS (
      SELECT *
      FROM jobs
      WHERE state = $1
      ORDER BY created_at
      LIMIT 1
      FOR UPDATE SKIP LOCKED
            )
    UPDATE jobs
    SET state = $2
      FROM next_job
    WHERE jobs.id = next_job.id
      RETURNING jobs.*;
  `,
    [State.PENDING, State.RUNNING],
  );

  return result.rows[0] ? row_to_job(result.rows[0]) : null;
}

export async function mark_job(job: Job, state: State): Promise<void> {
  const client = await get_client();

  let query = `
        UPDATE "jobs"
        SET "state" = $1
    `;
  const params = [state];

  if (state === State.RUNNING) {
    query += `, "started" = NOW()`;
  }

  if (state === State.DONE || state === State.FAILED) {
    query +=
      `, "finished" = NOW(), "duration" = EXTRACT(EPOCH FROM (NOW() - "started"))`;
  }

  query += ` WHERE "id" = $2`;
  console.log(job);
  params.push(job.id);

  await client.queryObject(query, params);
}

export async function run_job(job: Job): Promise<void> {
  try {
    await mark_job(job, State.RUNNING);

    console.log(job);

    const modelParamIndex = job.parameters.findIndex((p) => p.name === "model");

    if (modelParamIndex === -1) {
      throw new Error("Missing model parameter");
    }

    const model = job.parameters[modelParamIndex].value;

    const paramsObject = Object.fromEntries(
      job.parameters.map((p) => [p.name, p.value]),
    );

    job.parameters.splice(modelParamIndex, 1);
    const response = await fetch(
      `http://127.0.0.1:5002/train/${model}/${job.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paramsObject),
      },
    );

    const res = await response.json();
    console.log(res as ModelOutput);
    await outputMetricsToDb(res.result as ModelOutput);
    await mark_job(job, State.DONE);
  } catch (error) {
    await mark_job(job, State.FAILED);
    throw error;
  }
}
