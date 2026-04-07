import {
  get_database_schema,
  TableInfo,
  TableRow,
} from "../services/schema_service.ts";
import {
  DefaultPage,
  render_heading,
} from "../components/default_templates.tsx";
import { RenderTable } from "../components/table_template.tsx";
import { useSearchParams } from "react-router-dom";
// @ts-types="react"
import {
  // @ts-types="react"
  ReactElement,
  // @ts-types="react"
  useEffect,
  useState,
} from "react";

export function RenderSchema() {
  const [searchParams] = useSearchParams();
  const tableName = searchParams.get("table");

  const [content, setContent] = useState<ReactElement>(<span>Loading...</span>);

  useEffect(() => {
    async function fetchData() {
      if (tableName) {
        const schema = (await get_database_schema(tableName)) as TableRow[];
        setContent(<RenderTable rows={schema} />);
      } else {
        const tables = (await get_database_schema(null)) as TableInfo[];
        setContent(
          <>
            {render_heading("Available Tables")}
            <ul className="list w-1/2">
              {tables.map((t) => (
                <li key={t.table_name} className="list-row">
                  <a
                    className="link link-hover"
                    href="{`/schema?table=${encodeURIComponent(t.table_name)}`}"
                  >
                    {t.table_name}
                  </a>
                </li>
              ))}
            </ul>
          </>,
        );
      }
    }
    fetchData();
  }, [tableName]);

  return (
    <DefaultPage
      title={tableName ? `Schema: ${tableName}` : "All Tables"}
      content={content}
    />
  );
}
