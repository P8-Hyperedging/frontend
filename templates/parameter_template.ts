import { InputType, Parameter } from "../services/hgnn_service.ts";

export function render_parameter_form(
  parameters: Parameter[],
  model_names: Parameter,
): string {
  return `
    <div class="flex justify-center">
      ${generate_fieldset(model_names)}
      <form class="fieldset w-1/2 bg-base-200 border-base-300 rounded-box border p-4">
        ${parameters.map((parameter) => generate_fieldset(parameter)).join("")}

        <button class="btn btn-neutral mt-4" type="submit">Submit</button>
        <button class="btn btn-ghost mt-1" type="reset">Reset</button>
      </form>
    </div>
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
        <input type="number" class="input validator w-full" required min="${parameter.min}" max="${parameter.max}" value="${parameter.default}"/>
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
