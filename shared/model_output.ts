import * as z from "zod";

import { Parameter } from "./input_types.ts";

export const ModelOutput = z.object({
  job_id: z.string,
  training_time: z.coerce.number(),
  total_runtime: z.coerce.number(),
  seed: z.coerce.number(),
  train_acc: z.coerce.number(),
  valid_acc: z.coerce.number(),
  test_acc: z.string(),
  parameters: Parameter.array(),
  model_name: z.string(),
  id: z.coerce.number(),
});

export const Parameters = z.object({
  hidden_layer_size: z.coerce.number(),
  learning_rate: z.coerce.number(),
  weight_decay: z.coerce.number(),
  epochs: z.coerce.number(),
  train_proportion: z.coerce.number(),
  dropout: z.coerce.number(),
});

export type Parameters = z.infer<typeof Parameters>;

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
