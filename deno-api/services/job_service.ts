import { get_client } from "./database_service.ts";
import { Job, JobStateEnum, State } from "@shared/train.ts";
import { ModelOutput } from "@shared/model_output.ts";
import { outputMetricsToDb } from "./model_output_service.ts";
import { Logger } from "@deno-library/logger";
import { Optional } from "../optional.ts";

const logger = new Logger();

export async function insert_job(job: Job): Promise<Optional<Job>> {
  const client = await get_client();

  try {
    const result = await client?.queryObject(
      `
          INSERT INTO jobs (title,
                            description,
                            hidden_layer_size,
                            learning_rate,
                            weight_decay,
                            epochs,
                            train_proportion,
                            dropout,
                            started,
                            finished,
                            duration,
                            state,
                            model_name,
                            created_at,
                            patience,
                            seed,
                            quality_weight)
          VALUES ($1, $2,
                  $3, $4, $5, $6, $7, $8,
                  NULL, NULL, NULL,
                  $9, $10, NOW(), $11, $12, $13
                 )
          RETURNING id;
        `,
      [
        job.title ?? job.model_name,
        job.description ?? "",
        job.hidden_layer_size,
        job.learning_rate,
        job.weight_decay,
        job.epochs,
        job.train_proportion,
        job.dropout,
        33,
        job.model_name,
        job.patience,
        job.seed,
        job.quality_weight,
      ],
    );
    const id = result.rows[0].id;
    job.id = id;
  } catch (e: unknown) {
    logger.error(e);
    return [null, false];
  }
  return [job, true];
}

export async function get_all_jobs(): Promise<Job[]> {
  const client = await get_client();

  try {
    const result = await client?.queryObject(`
          SELECT *
          FROM "jobs";
      `);

    return result.rows.map((row) => Job.parse(row));
  } catch (e) {
    logger.error(e);
    return [];
  }
}

export async function get_first_pending_job(): Promise<Optional<Job>> {
  const client = await get_client();

  try {
    const result = await client?.queryObject(
      `
          WITH next_job AS (SELECT *
                            FROM jobs
                            WHERE state = $1
                            ORDER BY created_at
            LIMIT 1
            FOR
          UPDATE SKIP LOCKED
            )
          UPDATE jobs
          SET state = $2 FROM next_job
          WHERE jobs.id = next_job.id
            RETURNING jobs.*;
        `,
      [State.PENDING, State.RUNNING],
    );

    if (result.rows[0]) {
      return [Job.parse(result.rows[0]), true];
    } else {
      return [null, false];
    }
  } catch (e) {
    logger.error(e);
    return [null, false];
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
  params.push(job.id);

  await client?.queryObject(query, params);
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
      quality_weight: job.quality_weight,
      patience: job.patience,
      gamma: 0,
      milestones_input: "50,100",
      seed: job.seed,
    };

    logger.log("Started JOB: " + job.id);

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

    if (!response.ok || !res.result) {
      console.log(`Training failed: ${JSON.stringify(res)}`);
      await mark_job(job, State.FAILED);
      return;
    }

    try {
      await outputMetricsToDb(res.result as ModelOutput);
    } catch (dbError) {
      console.error(`Database error for job ${job.id}:`, dbError);
      await mark_job(job, State.FAILED);
      throw dbError;
    }

    await mark_job(job, State.DONE);
    console.log(`Job ${job.id} marked as DONE`);
  } catch (error) {
    console.error(`Error in run_job for ${job.id}:`, error);
    try {
      await mark_job(job, State.FAILED);
    } catch (markError) {
      console.error(`Failed to mark job ${job.id} as FAILED:`, markError);
    }
    throw error;
  }
}
