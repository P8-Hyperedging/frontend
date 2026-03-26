import { get_client } from "./database_service.ts";

export interface Model_output {
  job_id: string;
  training_time: number;
  total_runtime: number;
  seed: number;
  train_acc: number;
  valid_acc: number;
  test_acc: string;
  parameters: Parameters;
  model_name: string;
  id: number;
}

export interface Parameters {
  hidden_layer_size: number;
  learning_rate: number;
  weight_decay: number;
  epochs: number;
  train_proportion: number;
  dropout: number;
}

export async function get_model_outputs(): Promise<Model_output[]> {
  const client = await get_client();

  const result = await client.queryObject<Model_output>(
    `
      SELECT * FROM model_output;
    `,
  );

  return result.rows;
}
