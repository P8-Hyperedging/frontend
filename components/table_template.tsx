export type TableRow = {
  column_name: string;
  data_type: string;
  is_nullable: boolean | string;
  column_default?: string | null;
};

export function RenderTable<T extends TableRow>({ rows }: { rows: T[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Column</th>
          <th>Type</th>
          <th>Nullable</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.column_name}>
            <td>{r.column_name}</td>
            <td>{r.data_type}</td>
            <td>{String(r.is_nullable)}</td>
            <td>{r.column_default ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
