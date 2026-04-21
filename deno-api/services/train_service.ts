import { RedirectResponse } from "../responses.ts";
import { get_client } from "./database_service.ts";
import { TrainFormData } from "@shared/train.ts";

export default async function post_train(req: Request) {
  const form = await req.formData();
  const data: TrainFormData = TrainFormData.parse(
    Object.fromEntries(form.entries()),
  );

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
        state,
        model_name,
        created_at,
        seed
    ) VALUES (
        $1, $2, $3,
        $4, $5, $6, $7, $8, $9,
        NULL, NULL, NULL,
        $10, $11, NOW(), $12
    );
    `,
    [
      jobId,
      data.title ?? data.model_name,
      data.description ?? "",
      data.hidden_layer_size,
      data.lr,
      data.weight_decay,
      Math.round(data.num_epochs),
      data.train_proportion,
      data.dropout,
      33,
      data.model_name,
      data.seed,
    ],
  );

  return RedirectResponse(`/running-jobs`);
}
