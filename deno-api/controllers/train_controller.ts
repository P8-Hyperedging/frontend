import { Job, State, TrainFormData } from "@shared/train.ts";
import { ErrorResponse, RedirectResponse } from "../responses.ts";
import { hasValue } from "../optional.ts";
import { Logger } from "@deno-library/logger";
import { insert_job } from "../services/job_service.ts";

const logger = new Logger();
export default async function post_train(req: Request) {
  const form = await req.formData();
  const data: TrainFormData = TrainFormData.parse(
    Object.fromEntries(form.entries()),
  );

  const now = new Date();
  const job: Job = {
    id: null,
    title: data.title,
    description: data.description,
    model_name: data.model_name,

    hidden_layer_size: data.hidden_layer_size,
    learning_rate: data.lr,
    weight_decay: data.weight_decay,
    epochs: Math.round(data.num_epochs),
    train_proportion: data.train_proportion,
    dropout: data.dropout,
    seed: Math.round(data.seed),

    state: State.PENDING,
    patience: (data.patience && !Number.isNaN(data.patience)) ? Math.round(data.patience) : null,
    started: null,
    finished: null,
    duration: 0,
    created_at: now,
  };

  const inserted_job = await insert_job(job);

  if (!hasValue(inserted_job)) {
    const error = "failed to insert job";
    logger.error(error);
    return ErrorResponse(error);
  }

  return RedirectResponse(`/running-jobs`);
}
