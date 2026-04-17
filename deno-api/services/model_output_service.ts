import { JsonResponse, NoConnectionResponse } from "../responses.ts";
import { get_client } from "./database_service.ts";
import { Parameter, SelectParameter } from "@shared/input_types.ts";
import { Logger } from "@deno-library/logger";
import {
  BoxPlotData,
  HyperParameterPoint,
  HyperParameterRow,
  HyperParameterSeries,
  ModelOutput,
} from "@shared/model_output.ts";

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

export async function get_box_plot_data(): Promise<Response> {
  try {
    const client = await get_client();

    const result = await client.queryObject<BoxPlotData>(
      `
      SELECT model_name, valid_acc FROM model_output ORDER BY model_name ASC;
      `,
    );

    const box_plot_data = result.rows.map((row) => BoxPlotData.parse(row));

    return JsonResponse(box_plot_data);
  } catch (err) {
    logger.warn("Could not get box plot data", err);
    return NoConnectionResponse("Could not get box plot data");
  }
}

export async function get_hyperparameter_tuning_data(): Promise<Response> {
  try {
    const client = await get_client();

    const result = await client.queryObject<HyperParameterRow>(
      `
      SELECT 'Hidden Layer Size' AS parameter, parameters ->> 'Hidden Layer Size' AS value, AVG(valid_acc) AS avg_valid_acc
      FROM model_output WHERE model_name = 'QHGNN'
      GROUP BY parameters ->> 'Hidden Layer Size'

      UNION ALL

      SELECT 'Learning Rate', parameters ->> 'Learning Rate', AVG(valid_acc)
      FROM model_output WHERE model_name = 'QHGNN'
      GROUP BY parameters ->> 'Learning Rate'

      UNION ALL

      SELECT 'Weight Decay', parameters ->> 'Weight Decay', AVG(valid_acc)
      FROM model_output WHERE model_name = 'QHGNN'
      GROUP BY parameters ->> 'Weight Decay'

      UNION ALL

      SELECT 'Epochs', parameters ->> 'Epochs', AVG(valid_acc)
      FROM model_output WHERE model_name = 'QHGNN'
      GROUP BY parameters ->> 'Epochs';
      `,
    );

    const seriesMap = new Map<string, HyperParameterPoint[]>();

    for (const row of result.rows.map((row) => HyperParameterRow.parse(row))) {
      if (!seriesMap.has(row.parameter)) seriesMap.set(row.parameter, []);
      seriesMap.get(row.parameter)!.push({
        value: row.value,
        avg_valid_acc: row.avg_valid_acc,
      });
    }

    const series: HyperParameterSeries[] = Array.from(seriesMap.entries()).map(
      ([parameter_name, data]) => ({
        parameter_name,
        data: data.sort((a, b) => a.value - b.value),
      }),
    );

    return JsonResponse(series);
  } catch (err) {
    logger.warn("Could not get hyperparameter tuning data", err);
    return NoConnectionResponse("Could not get hyperparameter tuning data");
  }
}

export async function outputMetricsToDb(output: ModelOutput) {
  const client = await get_client();
  await client.queryObject(
    `
    INSERT INTO model_output
    (job_id, seed,
     train_acc, valid_acc, test_acc, parameters, model_name)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
  `,
    [
      output.job_id,
      output.seed,
      output.train_acc,
      output.valid_acc,
      output.test_acc,
      output.parameters,
      output.model_name,
    ],
  );
}
