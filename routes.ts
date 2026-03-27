import { getValue, hasValue } from "./optional.ts";
import { HtmlResponse, NoConnectionResponse } from "./reponses.ts";
import { get_model_names, get_parameters } from "./services/hgnn_service.ts";
import {
  get_database_schema,
  TableInfo,
  TableRow,
} from "./services/schema_service.ts";
import {
  render_default_page,
  render_heading,
} from "./templates/default_templates.ts";
import { render_table } from "./templates/table_template.ts";
import { render_results } from "./templates/results_templates.ts";
import { get_model_outputs } from "./services/model_output_service.ts";
import render_parameter_form, { render_parameter_form_content } from "./components/render_parameter_form.tsx";
import { renderToString } from "preact-render-to-string";

export async function home_page(url: URL) {
    return HtmlResponse(render_default_page("Hello!", "Hello!"))
}

export async function train_a_model_page(_url: URL) {
  const parameters = await get_parameters("allset");
  const model_names = await get_model_names();

  if (!hasValue(parameters) || !hasValue(model_names)) {
    return NoConnectionResponse("Python Server");
  }
  return HtmlResponse(
    render_default_page(
      "Welcome",
      renderToString(render_parameter_form(getValue(parameters), getValue(model_names))),
    ),
  );
}

export async function schema(url: URL) {
  const tableName = url.searchParams.get("table");

  if (tableName) {
    const schema = (await get_database_schema(tableName)) as TableRow[];
    return HtmlResponse(
      render_default_page(`Schema: ${tableName}`, render_table(schema))
    );
  } else {
    const tables = (await get_database_schema(null)) as TableInfo[];
    const linksHtml = tables
      .map(
        (t) =>
          `<li class="list-row"><a class="link link-hover" href="/schema?table=${
            encodeURIComponent(
              t.table_name,
            )
          }">${t.table_name}</a></li>`,
      )
      .join("");

    return HtmlResponse(
      render_default_page(
        "All Tables",
        `${
          render_heading(
            "Available Tables",
          )
        }<ul class="list w-1/2">${linksHtml}</ul>`,
      )
    );
  }
}

export async function paramter_form(url: URL) {
  const model_name = url.searchParams.get("model") as string;
  const model_parameters = await get_parameters(model_name);
  if (!hasValue(model_parameters)) {
    return NoConnectionResponse("Python Server");
  }
  return HtmlResponse(
    renderToString(render_parameter_form_content(getValue(model_parameters)))
  );
}

export async function results_page() {
  const model_outputs = await get_model_outputs();

  return HtmlResponse(
    render_default_page("Results", render_results(model_outputs))
  );
}


export async function running_jobs_page() {
  return HtmlResponse(
    render_default_page("Running jobs", "Running jobs")
  )
}
