import {
  get_database_schema,
  TableInfo,
  TableRow,
} from "./services/schema_service.ts";
import { render_table } from "./templates/table_template.ts";
import {
  render_default_page,
  render_heading,
} from "./templates/default_templates.ts";
import { serveFile } from "@std/http/file-server";
import { exists } from "@std/fs";
import {
  render_parameter_form,
  render_parameter_form_content,
} from "./templates/parameter_template.ts";
import { get_model_names, get_parameters } from "./services/hgnn_service.ts";
import { getValue, hasValue } from "./optional.ts";
import { NoConnectionResponse } from "./reponses.ts";
import { render_results } from "./templates/results_templates.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    if (pathname === "/schema") {
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
    } else if (pathname === "/parameter-form") {
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
    } else if (pathname === "/results") {
      return new Response(render_default_page("Results", render_results()), {
        headers: { "content-type": "text/html" },
      });
    }

    const filePath = pathname === "/" ? "/index.html" : pathname;
    const fullPath = `./public${filePath}`;

    // Check if the file exists
    if (await exists(fullPath)) {
      return await serveFile(req, fullPath);
    }

    const parameters = await get_parameters("allset");
    const model_names = await get_model_names();
    // File doesn't exist, return default page

    if (!hasValue(parameters) || !hasValue(model_names)) {
      return NoConnectionResponse("Python Server");
    }
    return new Response(
      render_default_page(
        "Welcome",
        `${render_parameter_form(getValue(parameters), getValue(model_names))}`,
      ),
      { headers: { "content-type": "text/html" } },
    );
  } catch (err) {
    // deno-lint-ignore no-console
    console.error(err);
    return new Response("Server error: " + err, { status: 500 });
  }
});
