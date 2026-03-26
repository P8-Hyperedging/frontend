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
import {
  render_parameter_form,
  render_parameter_form_content,
} from "./templates/parameter_template.ts";
import { render_table } from "./templates/table_template.ts";
import { render_results } from "./templates/results_templates.ts";

// deno-lint-ignore require-await
export async function home_page(_url: URL) {
  return HtmlResponse(render_default_page("Hello!", "Hello!"));
}

export async function train_a_model_page(_url: URL) {
  const parameters = await get_parameters("allset");
  const model_names = await get_model_names();
  // File doesn't exist, return default page

  if (!hasValue(parameters) || !hasValue(model_names)) {
    return NoConnectionResponse("Python Server");
  }
  return HtmlResponse(
    render_default_page(
      "Welcome",
      `${render_parameter_form(getValue(parameters), getValue(model_names))}`,
    ),
  );
}

export async function schema(url: URL) {
  const tableName = url.searchParams.get("table");

  if (tableName) {
    const schema = (await get_database_schema(tableName)) as TableRow[];
    return new Response(
      render_default_page(`Schema: ${tableName}`, render_table(schema)),
      { headers: { "content-type": "text/html" } },
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

    return new Response(
      render_default_page(
        "All Tables",
        `${
          render_heading(
            "Available Tables",
          )
        }<ul class="list w-1/2">${linksHtml}</ul>`,
      ),
      { headers: { "content-type": "text/html" } },
    );
  }
}

export async function paramter_form(url: URL) {
  const model_name = url.searchParams.get("model") as string;
  const model_parameters = await get_parameters(model_name);
  if (!hasValue(model_parameters)) {
    return NoConnectionResponse("Python Server");
  }
  return new Response(
    render_parameter_form_content(getValue(model_parameters)),
    {
      headers: { "content-type": "text/html" },
    },
  );
}

// deno-lint-ignore require-await
export async function fuck() {
  return new Response(render_default_page("Results", render_results()), {
    headers: { "content-type": "text/html" },
  });
}
