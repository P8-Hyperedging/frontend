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

export async function get_parameters(model_name: string): Promise<Parameter[]> {
  const response = await fetch(`http://127.0.0.1:5000/params/${model_name}`);
  const responseText = await response.text();
  const body = JSON.parse(responseText) as Parameter[];

  return body;
}

export async function get_model_names(): Promise<SelectParameter> {
  const response = await fetch("http://127.0.0.1:5000/models");
  const responseText = await response.text();
  const model_names = JSON.parse(responseText) as SelectParameter;

  return model_names;
}
