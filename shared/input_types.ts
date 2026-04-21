import * as z from "zod";

export const InputType = {
  Range: "range",
  Input: "input",
  Toggle: "toggle",
  Select: "select",
} as const;

export const InputTypeEnum = z.enum(InputType);

export type InputTypeEnum = z.infer<typeof InputTypeEnum>;

export const BaseParameter = z.object({
  name: z.string(),
  type: InputTypeEnum,
});

export type BaseParameter = z.infer<typeof BaseParameter>;

export const RangeParameter = z.object({
  ...BaseParameter.shape,
  type: InputTypeEnum.extract(["Range"]),
  min: z.coerce.number(),
  max: z.coerce.number(),
  step: z.coerce.number(),
  default: z.coerce.number(),
});

export type RangeParameter = z.infer<typeof RangeParameter>;

export const InputParameter = z.object({
  ...BaseParameter.shape,
  type: InputTypeEnum.extract(["Input"]),
  min: z.coerce.number(),
  max: z.coerce.number(),
  default: z.coerce.number(),
});

export type InputParameter = z.infer<typeof InputParameter>;

export const ToggleParameter = z.object({
  ...BaseParameter.shape,
  type: InputTypeEnum.extract(["Toggle"]),
  default: z.coerce.boolean(),
});

export type ToggleParameter = z.infer<typeof ToggleParameter>;

export const SelectParameter = z.object({
  ...BaseParameter.shape,
  type: InputTypeEnum.extract(["Select"]),
  options: z.string().array(),
});

export type SelectParameter = z.infer<typeof SelectParameter>;

export const Parameter = z.union([
  RangeParameter,
  InputParameter,
  ToggleParameter,
  SelectParameter,
]);

export type Parameter = z.infer<typeof Parameter>;
