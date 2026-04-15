import { RedirectResponse } from "../responses.ts";
import {get_client} from "./database_service.ts";

export default async function post_train(req: Request) {
  const form = await req.formData();

  const data: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    data[key] = String(value);
  }

  console.log(data)
  const jobId = crypto.randomUUID();

  const client = await get_client();

  await client.queryObject(
      `
    INSERT INTO jobs (
        id,
        title,
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
        state
    ) VALUES (
        $1, $2, $3,
        $4, $5, $6, $7, $8, $9,
        NULL, NULL, NULL,
        $10
    );
    `,
      [
        jobId,
        data.model_name ?? "Unnamed job",
        data.description ?? "",
        Number(data.hidden_layer_size),
        Number(data.learning_rate),
        Number(data.weight_decay),
        Number(data.epochs),
        Number(data.train_proportion),
        Number(data.dropout),
        0, // state = queued
      ],
  );

  // optionally trigger external training AFTER inserting job
  const targetUrl = new URL(
      `${Deno.env.get("BASEMENT_PC_IP")}/train/${data.model_name}`,
  );

  await fetch(targetUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_id: jobId,
      ...data,
    }),
  });

  return RedirectResponse(`/running-jobs`);
}