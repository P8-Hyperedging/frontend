import * as z from "zod";
import { JobStateEnum } from "./train.ts";

export const Parameters = z.object({
  hidden_layer_size: z.coerce.number().nullable(),
  learning_rate: z.coerce.number().nullable(),
  weight_decay: z.coerce.number().nullable(),
  epochs: z.coerce.number().nullable(),
  train_proportion: z.coerce.number().nullable(),
  valid_proportion: z.coerce.number().nullable(),
  dropout: z.coerce.number().nullable(),
});

export type Parameters = z.infer<typeof Parameters>;

export const ModelOutput = z.object({
  job_id: z.string().nullable(),
  seed: z.coerce.number(),
  train_acc: z.coerce.number().nullable(),
  valid_acc: z.coerce.number(),
  test_acc: z.coerce.number().nullable(),
  parameters: z.preprocess((val: string) => {
    if (!val || typeof val !== "object") return val;
    const p = val as Record<string, number>;
    return {
      hidden_layer_size: p["Hidden Layer Size"],
      learning_rate: p["Learning Rate"],
      weight_decay: p["Weight Decay"],
      epochs: p["Epochs"],
      train_proportion: p["Train Proportion"],
      valid_proportion: p["Valid Proportion"] ?? null,
      dropout: p["Dropout"],
    };
  }, Parameters.nullable()),
  model_name: z.string(),
  id: z.coerce.number(),
});

export type ModelOutput = z.infer<typeof ModelOutput>;

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

export const ModelResult = z.object({
  job_id: z.coerce.number(),
  valid_acc: z.coerce.number(),
  train_acc: z.coerce.number(),
  test_acc: z.coerce.number(),
  title: z.string(),
  description: z.string(),
  hidden_layer_size: z.coerce.number(),
  learning_rate: z.coerce.number(),
  weight_decay: z.coerce.number(),
  epochs: z.coerce.number(),
  train_proportion: z.coerce.number(),
  dropout: z.coerce.number(),
  started: z.coerce.date(),
  finished: z.coerce.date(),
  duration: z.coerce.number(),
  state: JobStateEnum,
  model_name: z.string(),
  created_at: z.coerce.date(),
  seed: z.coerce.number(),
  id: z.coerce.number(),
  patience: z.coerce.number(),
  quality_weight: z.coerce.number(),
});

export type ModelResult = z.infer<typeof ModelResult>;
