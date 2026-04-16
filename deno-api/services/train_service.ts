import { RedirectResponse } from "../responses.ts";
import { get_client } from "./database_service.ts";

export default async function post_train(req: Request) {
  const schema: Record<string, (v: string) => string | number | null> = {
    title: String,
    description: String,
    model_name: String,
    num_epochs: Number,
    lr: Number,
    hidden_layer_size: Number,
    train_proportion: Number,
    valid_proportion: Number,
    dropout: Number,
    weight_decay: Number,
    seed: (v) => (v === "" ? null : Number(v)),
  };

  const form = await req.formData();
  const data: Record<string, string | number | null> = {};

  for (const [key, value] of form.entries()) {
    const converter = schema[key];
    data[key] = converter ? converter(String(value)) : String(value);
  }

  console.log(data);
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
      data.title ?? data.model_name,
      data.description ?? "",
      data.hidden_layer_size,
      data.lr,
      data.weight_decay,
      data.num_epochs,
      data.train_proportion,
      data.dropout,
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

