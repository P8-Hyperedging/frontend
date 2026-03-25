import {
  InputType,
  Parameter,
  SelectParameter,
} from "../services/hgnn_service.ts";

export function render_parameter_form(
  parameters: Parameter[],
  model_names: SelectParameter,
): string {
  return `
    <div class="flex flex-col w-full items-center gap-4">
      <div class="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
      <fieldset class="fieldset w-1/2 flex flex-col items-center">
        <legend class=fieldset-legend>Select a model</legend>
        <select 
          class="select select-primary select-xl w-full"
          name="model"
          hx-get="/parameter-form"
          hx-trigger="change"
          hx-target="#parameter-form-content"
          hx-swap="innerHTML">
          ${
    model_names.options.map(
      (option) => `<option value="${option}">${option}</option>`,
    )
  }
        </select>
      </fieldset>

      <form class="fieldset w-full">
        <div id="parameter-form-content">
          ${render_parameter_form_content(parameters)}
        </div>
      </form>
      </div>
    </div>
  `;
}

export function render_parameter_form_content(parameters: Parameter[]): string {
  return `        
    ${parameters.map((parameter) => generate_fieldset(parameter)).join("")}
    <button class="btn btn-neutral mt-4" type="submit">Submit</button>
    <button class="btn btn-ghost mt-1" type="reset">Reset</button>
  `;
}

function generate_fieldset(parameter: Parameter): string {
  let content: string;
  switch (parameter.type) {
    case InputType.Range:
      content = `
        <label>${parameter.name}</label>
        <input type="range" class="range range-primary w-full" required min="${parameter.min}" max="${parameter.max}" value="${parameter.default}" step="${parameter.step}"/>
        <p class="validator-hint hidden">Must input a number</p>
    `;
      break;
    case InputType.Input:
      content = `
        <label>${parameter.name}</label>
        <input type="number" class="input validator w-full" required min="${parameter.min}" max="${parameter.max}" value="${parameter.default}" step="0.0001"/>
        <p class="validator-hint hidden">Must input a number</p>
    `;
      break;
    case InputType.Toggle:
      content = `
        <label>${parameter.name}</label>
        <input type="checkbox" class="toggle" required ${
        parameter.default ? 'checked="checked"' : ""
      }/>
    `;
      break;
    case InputType.Select:
      content = `
        <select class="select select-success">
          <option disabled selected>${parameter.name}</option>
          ${
        parameter.options
          .map((option) => `<option>${option}</option>`)
          .join("")
      }
        </select>
    `;
      break;
    default:
      content = ``;
      break;
  }

  return `
    <fieldset class="fieldset">
      ${content}
    </fieldset>
  `;
}
