import { Model_output } from "../services/model_output_service.ts";

export function render_results(model_outputs: Model_output[]): string {
  return `
  <div class="flex flex-col w-full items-center gap-4">
    <div class="w-auto flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4 shadow-xl">
      <h1 class="text-xl">This is results page xD</h1>

      ${render_results_table(model_outputs)}
    </div>
  </div>
`;
}

function render_results_table(model_outputs: Model_output[]): string {
  return `
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          ${
    Object.keys(model_outputs[0])
      .map((key) => `<th>${key}</th>`)
      .join("")
  }
        </tr>
      </thead>

      <tbody>
        ${
    model_outputs
      .map((row, index) => {
        return `
              <tr>
                <th>${index + 1}</th>
                <td>${row.job_id}</td>
                <td>${row.training_time}</td>
                <td>${row.total_runtime}</td>
                <td>${row.seed}</td>
                <td>${row.train_acc}</td>
                <td>${row.valid_acc}</td>
                <td>${row.test_acc}</td>

                <td>
                  <div class="dropdown">
                    <div tabindex="0" role="button" class="btn m-1">
                      Parameters
                    </div>
                    <div class="dropdown-content bg-base-300 rounded-box p-2 shadow-2xl">
                      <table class="table table-xs">
                        <tbody>
                          ${
          Object.entries(row.parameters)
            .map(
              ([key, value]) => `
                                <tr>
                                  <td class="font-semibold">${key}</td>
                                  <td>${value}</td>
                                </tr>
                              `,
            )
            .join("")
        }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>

                <td>${row.model_name}</td>
                <td>${row.id}</td>
              </tr>
            `;
      })
      .join("")
  }
      </tbody>
    </table>
  `;
}
