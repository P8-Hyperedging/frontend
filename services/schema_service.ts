import { get_client } from "./database_service.ts";

export interface TableRow {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  table_rows: number | null;
}

export interface TableInfo {
  table_name: string;
}

export async function get_database_schema(
  tableName: string | null,
): Promise<TableRow[] | TableInfo[]> {
  const client = await get_client();

  if (tableName) {
    // Get column info plus table row count
    const result = await client.queryObject<TableRow>(
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
    return result.rows;
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
    return result.rows;
  }
}
