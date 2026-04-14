import { useEffect, useState } from "react";
import { InputType, Parameter, SelectParameter } from "@shared/parameters.ts";

export default function ParameterForm({
  parameters,
  model_names,
}: {
  parameters: Parameter[];
  model_names: SelectParameter;
}) {
  const [selectedModel, setSelectedModel] = useState(model_names.options[0]);
  const [currentParams, setCurrentParams] = useState(parameters);

  useEffect(() => {
    async function fetchParams() {
      const res = await fetch(
        `/api/get-parameters?model_name=${encodeURIComponent(selectedModel)}`,
      );
      const data = await res.json();
      setCurrentParams(data);
    }

    fetchParams();
  }, [selectedModel]);

  return (
    <div className="flex flex-col w-full items-center gap-4">
      <div className="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
        <fieldset className="fieldset w-1/2 flex flex-col items-center">
          <legend className="fieldset-legend">Select a model</legend>
          <select
            className="select select-primary select-xl w-full"
            name="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {model_names.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </fieldset>

        <form className="fieldset w-full" method="post" action="/api/train">
          <div id="parameter-form-content">
            <ParameterFormContent
              parameters={currentParams}
              model_name={selectedModel}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function ParameterFormContent({
  parameters,
  model_name,
}: {
  parameters: Parameter[];
  model_name: string;
}) {
  return (
    <>
      {parameters.map((parameter) => (
        <Fieldset key={parameter.name} parameter={parameter} />
      ))}
      <input
        type="text"
        defaultValue={model_name}
        className="hidden"
        name="model_name"
      />
      <button className="btn btn-neutral mt-4" type="submit">
        <i className="material-icons">send</i>Submit
      </button>
      <button className="btn btn-ghost mt-1" type="reset">
        <i className="material-icons">restart_alt</i>Reset
      </button>
    </>
  );
}

function Fieldset({ parameter }: { parameter: Parameter }) {
  const parameter_name = parameter.name.replaceAll(" ", "_");
  let content = null;

  switch (parameter.type) {
    case InputType.Range:
      content = (
        <>
          <label>{parameter.name}</label>
          <input
            type="range"
            name={parameter_name}
            className="range range-primary w-full"
            required
            min={parameter.min}
            max={parameter.max}
            defaultValue={parameter.default}
            step={parameter.step}
          />
          <p className="validator-hint hidden">Must input a number</p>
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
            className="input validator w-full"
            required={parameter.name !== "seed" || undefined}
            min={parameter.min}
            max={parameter.max}
            defaultValue={parameter.default}
            step="0.0001"
          />
          <p className="validator-hint hidden">Must input a number</p>
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
            className="toggle"
            required
            defaultChecked={parameter.default}
          />
        </>
      );
      break;
    case InputType.Select:
      content = (
        <>
          <select className="select select-success" name={parameter_name}>
            <option disabled value="">
              {parameter.name}
            </option>
            {parameter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </>
      );
      break;
  }

  return <fieldset className="fieldset">{content}</fieldset>;
}
