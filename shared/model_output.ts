import {Parameter} from "./input_types.ts";

export interface ModelOutput {
  job_id: string;
  training_time: number;
  total_runtime: number;
  seed: number;
  train_acc: number;
  valid_acc: number;
  test_acc: string;
  parameters: Parameter[];
  model_name: string;
  id: number;
}

