export enum InputType {
  Range,
  Input,
  Toggle,
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

export function get_parameters(): Parameter[] {
  return [
    { name: "param1", min: 1, max: 5, default: 2, type: InputType.Range },
    { name: "param2", min: 1, max: 5, default: 3, type: InputType.Range },
    { name: "param3", min: 1, max: 500, default: 200, type: InputType.Input },
    { name: "param3", default: true, type: InputType.Toggle },
  ];
}
