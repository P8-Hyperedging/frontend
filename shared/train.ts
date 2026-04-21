import * as z from "zod";

export const TrainFormData = z
  .object({
    title: z.string(),
    description: z.string(),
    model_name: z.string(),
  })
  .catchall(z.coerce.number());

export type TrainFormData = z.infer<typeof TrainFormData>;

export const State = {
  DONE: 10,
  RUNNING: 14,
  FAILED: 22,
  PENDING: 33,
} as const;

export const JobStateEnum = z.enum(State);

export type JobStateEnum = z.infer<typeof JobStateEnum>;

export const Job = z.object({
  id: z.uuidv4(),
  title: z.string(),
  description: z.string(),
  model_name: z.string(),
  hidden_layer_size: z.coerce.number(),
  learning_rate: z.coerce.number(),
  weight_decay: z.coerce.number(),
  epochs: z.coerce.number(),
  train_proportion: z.coerce.number(),
  dropout: z.coerce.number(),
  state: JobStateEnum,
  seed: z.coerce.number(),
  started: z.date().nullable(),
  finished: z.date().nullable(),
  duration: z.coerce.number(),
  created_at: z.date(),
});

export type Job = z.infer<typeof Job>;
