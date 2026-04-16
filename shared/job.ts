import { Parameter } from "./input_types.ts";

export class Job {
  id: string;
  title: string;
  description: string;
  parameters: Parameter[];
  started: Date | null;
  finished: Date | null;
  duration: number | null;
  state: State;

  constructor(init?: Partial<Job>) {
    this.id = init?.id ?? crypto.randomUUID();
    this.title = init?.title ?? "";
    this.description = init?.description ?? "";
    this.parameters = init?.parameters ?? [];
    this.started = init?.started ?? null;
    this.finished = init?.finished ?? null;
    this.duration = init?.duration ?? null;
    this.state = init?.state ?? State.PENDING;
  }

  clone(): Job {
    return new Job({
      id: this.id,
      title: this.title,
      description: this.description,
      parameters: [...this.parameters],
      started: this.started,
      finished: this.finished,
      duration: this.duration,
      state: this.state,
    });
  }
}

export enum State {
  DONE = 10,
  RUNNING = 14,
  FAILED = 22,
  PENDING = 33,
}

export function jobStateToText(state) {
  switch (state) {
    case State.DONE:
      return "Done";
    case State.RUNNING:
      return "Running";
    case State.FAILED:
      return "Running Failed";
    case State.PENDING:
      return "Pending";
    default:
      return "Unknown";
  }
}
