import { JsonResponse, NoConnectionResponse } from "../responses.ts";
import { get_client } from "./database_service.ts";
import { Parameter, SelectParameter } from "@shared/input_types.ts";
import { Logger } from "@deno-library/logger";
import { ModelOutput } from "@shared/model_output.ts";
const logger = new Logger();

export async function get_model_outputs(): Promise<Response> {
  const client = await get_client();

  const result = await client.queryObject<ModelOutput>(
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
