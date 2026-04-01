export { render_table };

export type TableRow = {
  column_name: string;
  data_type: string;
  is_nullable: boolean | string;
  column_default?: string | null;
};

function render_table<T extends TableRow>(rows: T[]) {
  return (
    <>
      <table class="table">
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th>Nullable</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          $
          {rows
            .map(
              (r) => `
            <tr>
              <td>${r.column_name}</td>
              <td>${r.data_type}</td>
              <td>${r.is_nullable}</td>
              <td>${r.column_default ?? ""}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </>
  );
}
