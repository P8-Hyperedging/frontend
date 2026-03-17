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
import { render_parameter_form } from "./templates/parameter_template.ts";
import { get_parameters } from "./services/hgnn_service.ts";

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
    }

    const filePath = pathname === "/" ? "/index.html" : pathname;
    const fullPath = `./public${filePath}`;

    // Check if the file exists
    if (await exists(fullPath)) {
      return await serveFile(req, fullPath);
    }

    // File doesn't exist, return default page
    return new Response(
      render_default_page(
        "Welcome",
        `${render_heading("Halloej og velkommen til vores projekt!")} ${
          render_parameter_form(get_parameters())
        }`,
      ),
      { headers: { "content-type": "text/html" } },
    );
  } catch (err) {
    // deno-lint-ignore no-console
    console.error(err);
    return new Response("Server error: " + err, { status: 500 });
  }
});
