import {get_client} from "./database_service.ts";

export async function get_all_jobs(): Promise<Response> {
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

    return result;
}