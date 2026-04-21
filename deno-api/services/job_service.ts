import { get_client } from "./database_service.ts";
import { Job, JobStateEnum, State } from "@shared/train.ts";
import { ModelOutput } from "@shared/model_output.ts";
import { outputMetricsToDb } from "./model_output_service.ts";
import { Logger } from "@deno-library/logger";

const logger = new Logger();

export async function get_all_jobs(): Promise<Job[]> {
  const client = await get_client();

  const result = await client.queryObject(`
        SELECT
            *
        FROM "jobs";
    `);

  return result.rows.map((row) => Job.parse(row));
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

  if (result.rows[0]) {
    return Job.parse(result.rows[0]);
  } else {
    return null;
  }
}

export async function mark_job(job: Job, state: JobStateEnum): Promise<void> {
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
  params.push(job.state);

  await client.queryObject(query, params);
}

export async function run_job(job: Job): Promise<void> {
  try {
    await mark_job(job, State.RUNNING);

    //
    // I am not sure that the jobs table has all the data needed
    //
    const paramsObject = {
      num_epochs: job.epochs,
      lr: job.learning_rate,
      hidden_layer_size: job.hidden_layer_size,
      train_proportion: job.train_proportion,
      valid_proportion: 1 - job.train_proportion,
      dropout: job.dropout,
      weight_decay: job.weight_decay,
      gamma: 0,
      milestones_input: "50,100",
      seed: job.seed,
    };
    
    logger.log("Started JOB: " + job.id)

    const response = await fetch(
      `http://127.0.0.1:5002/train/${job.model_name}/${job.id}`,
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
