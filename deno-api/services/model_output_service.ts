import { JsonResponse, NoConnectionResponse } from "../respons.ts";
import { get_client } from "./database_service.ts";
import { Parameter, SelectParameter } from "./hgnn_service.ts";
import { Logger } from "@deno-library/logger";
const logger = new Logger();

export interface Model_output {
  job_id: string;
  training_time: number;
  total_runtime: number;
  seed: number;
  train_acc: number;
  valid_acc: number;
  test_acc: string;
  parameters: Parameters;
  model_name: string;
  id: number;
}

export interface Parameters {
  hidden_layer_size: number;
  learning_rate: number;
  weight_decay: number;
  epochs: number;
  train_proportion: number;
  dropout: number;
}

export async function get_model_outputs(): Promise<Response> {
  const client = await get_client();

  const result = await client.queryObject<Model_output>(
    `
      SELECT * FROM model_output;
    `,
  );
  const model_outputs = result.rows;

  if (!model_outputs) {
    // litteraly no model outputs
    return JsonResponse(null);
  }

  return JsonResponse(model_outputs);
}

export async function get_parameters(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const model_name = url.searchParams.get("model_name");
  try {
    const response = await fetch(
      `${Deno.env.get("BASEMENT_PC_IP")}/params/${model_name}`,
    );

    if (!response.ok) {
      return NoConnectionResponse("Could not get paramters");
    }
    const responseText = await response.text();
    const body = JSON.parse(responseText) as Parameter[];
    return JsonResponse(body);
  } catch (err) {
    logger.warn("Could not get paramters", err);
    return NoConnectionResponse("Could not get paramters");
  }
}

export async function get_model_names(): Promise<Response> {
  try {
    const response = await fetch(`${Deno.env.get("BASEMENT_PC_IP")}/models`);
    const responseText = await response.text();
    const model_names = JSON.parse(responseText) as SelectParameter;

    return JsonResponse(model_names);
  } catch (err) {
    logger.warn("Could not get model names", err);
    return NoConnectionResponse("Could not get model names");
  }
}
