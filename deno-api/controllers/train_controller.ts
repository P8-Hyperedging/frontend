import { Job, TrainFormData, State } from "@shared/train.ts";
import {ErrorResponse, RedirectResponse} from "../responses.ts";
import {hasValue} from "../optional.ts";
import { Logger } from "@deno-library/logger";
import {insert_job} from "../services/job_service.ts";

const logger = new Logger();
export default async function post_train(req: Request) {
    const form = await req.formData();
    const data: TrainFormData = TrainFormData.parse(
        Object.fromEntries(form.entries()),
    );

    const now = new Date();

    const job: Job = {
        id: "",
        title: data.title,
        description: data.description,
        model_name: data.model_name,

        // defaults or pulled from catchall
        hidden_layer_size: data.hidden_layer_size ?? 128,
        learning_rate: data.learning_rate ?? 0.001,
        weight_decay: data.weight_decay ?? 0,
        epochs: data.epochs ?? 10,
        train_proportion: data.train_proportion ?? 0.8,
        dropout: data.dropout ?? 0.1,
        seed: data.seed ?? 42,

        state: State.PENDING,

        started: null,
        finished: null,
        duration: 0,
        created_at: now,
    };
    
    const inserted_job = await insert_job(job);
    
    if (!hasValue(inserted_job)) {
        const error = "failed to insert job";
        logger.error(error)
        return ErrorResponse(error);
    }
    

    return RedirectResponse(`/running-jobs`);
}