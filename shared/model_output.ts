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

export interface BoxPlotData {
  model_name: string;
  valid_acc: number;
}
