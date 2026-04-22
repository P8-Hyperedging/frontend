import { JsonResponse } from "../responses.ts";
import { get_client } from "./database_service.ts";
import { TableInfo, TableRow } from "@shared/table.ts";

export async function get_database_schema(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const tableName = url.searchParams.get("table");
  const client = await get_client();

  if (tableName) {
    // Get column info plus table row count
    const result = await client?.queryObject<TableRow>(
      `
        SELECT
            c.column_name,
            c.data_type,
            c.is_nullable,
            c.column_default,
            c.character_maximum_length,
            t.reltuples::bigint AS table_rows
        FROM information_schema.columns c
                  JOIN pg_class t ON t.relname = $1
        WHERE c.table_name = $1
        ORDER BY c.ordinal_position;
            `,
      [tableName],
    );
    return JsonResponse(result.rows);
  } else {
    // Return list of tables
    const result = await client.queryObject<TableInfo>(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      ORDER BY table_name;
            `,
    );
    return JsonResponse(result.rows);
  }
}
