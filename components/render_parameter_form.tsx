import {
  InputType,
  Parameter,
  SelectParameter,
} from "../services/hgnn_service.ts";

export default function render_parameter_form(
  parameters: Parameter[],
  model_names: SelectParameter,
) {
  return (
    <div class="flex flex-col w-full items-center gap-4">
      <div class="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
        <fieldset class="fieldset w-1/2 flex flex-col items-center">
          <legend class="fieldset-legend">Select a model</legend>
          <select
            class="select select-primary select-xl w-full"
            name="model"
            hx-get="/parameter-form"
            hx-trigger="change"
            hx-target="#parameter-form-content"
            hx-swap="innerHTML"
          >
            {model_names.options.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </fieldset>

        <form class="fieldset w-full" method="post" action="/train">
          <div id="parameter-form-content">
            {render_parameter_form_content(parameters, model_names.options[0])}
          </div>
        </form>
      </div>
    </div>
  );
}

export function render_parameter_form_content(
  parameters: Parameter[],
  model_name: string,
) {
  const val = parameters.map((parameter) => generate_fieldset(parameter));
  return (
    <>
      {val}
      <input type="text" value={model_name} class="hidden" name="model_name" />
      <button class="btn btn-neutral mt-4" type="submit">
        <i class="material-icons">send</i>Submit
      </button>
      <button class="btn btn-ghost mt-1" type="reset">
        <i class="material-icons">restart_alt</i>Reset
      </button>
    </>
  );
}

function generate_fieldset(parameter: Parameter) {
  let content = null;
  const parameter_name = parameter.name.replaceAll(" ", "_")
  switch (parameter.type) {
    case InputType.Range:
      content = (
        <>
          <label>{parameter.name}</label>
          <input
            type="range"
            name={parameter_name}
            class="range range-primary w-full"
            required
            min={parameter.min}
            max={parameter.max}
            value={parameter.default}
            step={parameter.step}
          />
          <p class="validator-hint hidden">Must input a number</p>
        </>
      );
      break;
    case InputType.Input:
      content = (
        <>
          <label>{parameter.name}</label>
          <input
            type="number"
            name={parameter_name}
            class="input validator w-full"
            required={parameter.name !== "seed" || undefined}
            min={parameter.min}
            max={parameter.max}
            value={parameter.default}
            step="0.0001"
          />
          <p class="validator-hint hidden">Must input a number</p>
        </>
      );
      break;
    case InputType.Toggle:
      content = (
        <>
          <label>{parameter.name}</label>
          <input
            type="checkbox"
            name={parameter_name}
            class="toggle"
            required
            checked={parameter.default}
          />
        </>
      );
      break;
    case InputType.Select:
      content = (
        <>
          <select class="select select-success" name={parameter_name}>
            <option disabled selected>
              {parameter.name}
            </option>
            {parameter.options
              .map((option) => `<option>${option}</option>`)
              .join("")}
          </select>
        </>
      );
      break;
  }

  return <fieldset class="fieldset">{content}</fieldset>;
}
