import {get_client} from "./database_service.ts";
import {TableRow} from "../templates/table_template.ts";

export async function get_database_schema(tableName: string): Promise<TableRow[]> {
    const client = get_client();

    const schemaResult = await client.queryObject<TableRow>(
        `
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position;
  `,
        [tableName]
    );

    return schemaResult.rows;
}