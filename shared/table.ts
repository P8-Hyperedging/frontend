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
