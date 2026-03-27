import { Optional } from "../optional.ts";
import { Logger } from "@deno-library/logger";
const logger = new Logger();

export enum InputType {
  Range = "range",
  Input = "input",
  Toggle = "toggle",
  Select = "select",
}

interface BaseParameter {
  name: string;
  type: InputType;
}

export interface RangeParameter extends BaseParameter {
  type: InputType.Range;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface InputParameter extends BaseParameter {
  type: InputType.Input;
  min: number;
  max: number;
  default: number;
}

export interface ToggleParameter extends BaseParameter {
  type: InputType.Toggle;
  default: boolean;
}

export interface SelectParameter extends BaseParameter {
  type: InputType.Select;
  options: string[];
}

export type Parameter =
  | RangeParameter
  | InputParameter
  | ToggleParameter
  | SelectParameter;

export async function get_parameters(
  model_name: string,
): Promise<Optional<Parameter[]>> {
  try {
    const response = await fetch(`http://127.0.0.1:5002/params/${model_name}`);
    const responseText = await response.text();
    const body = JSON.parse(responseText) as Parameter[];
    return [body, true];
  } catch (err) {
    logger.warn("Could not get paramters", err);
    return [null, false];
  }
}

export async function get_model_names(): Promise<Optional<SelectParameter>> {
  try {
    const response = await fetch("http://127.0.0.1:5002/models");
    const responseText = await response.text();
    const model_names = JSON.parse(responseText) as SelectParameter;

    return [model_names, true];
  } catch (err) {
    logger.warn("Could not get model names", err);
    return [null, false];
  }
}
