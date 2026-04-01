import {
  get_database_schema,
  TableInfo,
  TableRow,
} from "../services/schema_service.ts";
import {
  render_default_page,
  render_heading,
} from "../components/default_templates.tsx";
import { render_table } from "../components/table_template.tsx";

export async function render_schema(req: Request) {
  const url = new URL(req.url);
  const tableName = url.searchParams.get("table");

  if (tableName) {
    const schema = (await get_database_schema(tableName)) as TableRow[];
    return render_default_page(`Schema: ${tableName}`, render_table(schema));
  } else {
    const tables = (await get_database_schema(null)) as TableInfo[];
    const linksHtml = tables.map((t) => (
      <li class="list-row">
        <a
          class="link link-hover"
          href="/schema?table=${
            encodeURIComponent(
              t.table_name,
            )
          }"
        >
          {t.table_name}
        </a>
      </li>
    ));

    return render_default_page(
      "All Tables",
      <>
        {render_heading("Available Tables")}
        <ul class="list w-1/2">{linksHtml}</ul>
      </>,
    );
  }
}
