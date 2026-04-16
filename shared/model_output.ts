import * as z from "zod";

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

export const BoxPlotData = z.object({
  model_name: z.string(),
  valid_acc: z.coerce.number(),
});

export type BoxPlotData = z.infer<typeof BoxPlotData>;

export const HyperParameterRow = z.object({
  parameter: z.string(),
  value: z.coerce.number(),
  avg_valid_acc: z.coerce.number(),
});

export type HyperParameterRow = z.infer<typeof HyperParameterRow>;

export const HyperParameterPoint = z.object({
  value: z.coerce.number(),
  avg_valid_acc: z.coerce.number(),
});

export type HyperParameterPoint = z.infer<typeof HyperParameterPoint>;

export const HyperParameterSeries = z.object({
  parameter_name: z.string,
  data: HyperParameterPoint.array(),
});

export type HyperParameterSeries = z.infer<typeof HyperParameterSeries>;
