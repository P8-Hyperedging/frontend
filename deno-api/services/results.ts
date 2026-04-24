import { ModelResult } from "@shared/model_output.ts";
import { ErrorResponse, JsonResponse } from "../responses.ts";
import { get_client } from "./database_service.ts";

export async function get_model_results(): Promise<Response> {
  const client = await get_client();

  if (!client) return ErrorResponse("Failed getting model results");

  const result = await client.queryObject<ModelResult>(
    `
      SELECT * FROM (
        SELECT mo.job_id, mo.valid_Acc, mo.train_acc, mo.test_acc
        FROM model_output AS mo
      ) AS model_results
      JOIN jobs
        ON jobs.id = model_results.job_id;
    `,
  );

  const modelResults = result.rows.map((row) => {
    return ModelResult.parse(row);
  });

  return JsonResponse(modelResults);
}
