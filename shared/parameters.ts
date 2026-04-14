export enum InputType {
  Range = "range",
  Input = "input",
  Toggle = "toggle",
  Select = "select",
  Text = "text",
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

export interface TextInputParameter extends BaseParameter {
  type: InputType.Text;
  placeholder: string;
}

export type Parameter =
  | RangeParameter
  | InputParameter
  | ToggleParameter
  | SelectParameter
  | TextInputParameter;
