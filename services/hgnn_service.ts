export enum InputType {
  Range = "range",
  Input = "input",
  Toggle = "toggle",
}

interface BaseParameter {
  name: string;
  type: InputType;
}

export interface RangeParameter extends BaseParameter {
  type: InputType.Range;
  min: number;
  max: number;
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

export type Parameter = RangeParameter | InputParameter | ToggleParameter;

export async function get_parameters(): Promise<Parameter[]> {
  const response = await fetch("http://127.0.0.1:5000/params");
  const responseText = await response.text();
  const body = JSON.parse(responseText) as Parameter[];

  return body;
}
