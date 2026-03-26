export function render_results(): string {
  return `
  <div class="flex flex-col w-full items-center gap-4">
    <div class="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4 shadow-xl">
      <h1 class="text-xl">This is results page xD</h1>

      ${render_results_table()}
    </div>
  </div>
`;
}

function render_results_table(): string {
  return `
    <table class="table">
      <thead>
        <tr>
          <th>param 0</th>
          <th>param 1</th>
          <th>param 2</th>
          <th>param 3</th>
        </th>
      </thead>

      <tbody>
        <tr>
          <th>text 1</th>
          <th>text 2</th>
          <th>text 3</th>
          <th>text 4</th>
        </tr>
      </tbody>
    </table>
  `;
}
