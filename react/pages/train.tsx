import { useEffect, useRef, useState } from "react";
import { DefaultPage } from "../components/default_templates.tsx";
import { InputType, Parameter, SelectParameter } from "@shared/input_types.ts";
import { ErrorPage } from "./errorpage.tsx";
import { Job } from "@shared/train.ts";

export function TrainModel() {
  const [job, setJob] = useState<Job>({});
  const [modelNames, setModelNames] = useState<SelectParameter | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [currentParams, setCurrentParams] = useState<Parameter[]>([]);
  const cachedParameters = useRef<Record<string, Parameter[]>>({});

  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const params_res = await fetch("/api/get-parameters?model_name=allset");

      if (!params_res.ok) {
        setErrorCode(params_res.status);
        const error_message = await params_res.json();
        setErrorMessage(error_message.error);
        return;
      }

      const parameters = await params_res.json(); // ← don't touch job here

      const model_names_res = await fetch("/api/get-model-names");
      if (!model_names_res.ok) {
        setErrorCode(model_names_res.status);
        const error_message = await model_names_res.json();
        setErrorMessage(error_message.error);
        return;
      }

      const model_names_data = await model_names_res.json();
      setModelNames(model_names_data);

      const firstModel = model_names_data.options[0];
      setSelectedModel(firstModel);

      setJob({ parameters }); // ← construct the job object here
    }

    fetchData();
  }, []);

  // fetch params when model changes
  useEffect(() => {
    async function fetchParams() {
      if (!selectedModel) return;

      if (cachedParameters.current[selectedModel]) {
        setCurrentParams(cachedParameters.current[selectedModel]);
        return;
      }

      const res = await fetch(
        `/api/get-parameters?model_name=${encodeURIComponent(selectedModel)}`,
      );

      const data = await res.json();
      cachedParameters.current[selectedModel] = data;
      setCurrentParams(data);
    }

    fetchParams();
  }, [selectedModel]);

  if (errorCode !== null && errorMessage !== null) {
    return <ErrorPage errorMessage={errorMessage} errorCode={errorCode} />;
  }

  if (!job || !modelNames || !selectedModel) {
    return (
      <ErrorPage
        errorCode={503}
        errorMessage="No connection to the Python server!"
      />
    );
  }

  return (
    <DefaultPage
      title="Train"
      content={
        <>
          <fieldset className="fieldset w-1/2 flex flex-col items-center">
            <legend className="fieldset-legend">Select a model</legend>
            <select
              className="select select-primary select-xl w-full"
              name="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {modelNames.options.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </fieldset>

          <form className="fieldset w-full" method="post" action="/api/train">
            <div className="flex flex-col w-full items-center">
              <h1 className="text-xl">Job Parameters</h1>
              <fieldset className="fieldset w-full">
                <label>Title</label>
                <input type="text" name="title" className="input w-full" />
              </fieldset>
              <fieldset className="fieldset w-full">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  className="textarea h-24 w-full"
                />
              </fieldset>
              <div className="divider"></div>
            </div>

            <div>
              <h3 className="text-center text-xl">Parameters:</h3>
              {currentParams.map((parameter) => (
                <Fieldset key={parameter.name} parameter={parameter} />
              ))}

              <input type="hidden" name="model_name" value={selectedModel} />
            </div>

            <button className="btn btn-neutral mt-4" type="submit">
              <i className="material-icons">send</i>Submit
            </button>

            <button className="btn btn-ghost mt-1" type="reset">
              <i className="material-icons">restart_alt</i>Reset
            </button>
          </form>
        </>
      }
    />
  );
}

function Fieldset({ parameter }: { parameter: Parameter }) {
  const name = parameter.name != undefined
    ? parameter.name.replaceAll(" ", "_")
    : " ";

  switch (parameter.type) {
    case InputType.Range:
      return (
        <fieldset className="fieldset">
          <label>{parameter.name}</label>
          <input
            type="range"
            name={name}
            className="range range-primary w-full"
            min={parameter.min}
            max={parameter.max}
            step={parameter.step}
            defaultValue={parameter.default}
          />
        </fieldset>
      );

    case InputType.Input:
      return (
        <fieldset className="fieldset">
          <label>{parameter.name}</label>
          <input
            type="number"
            name={name}
            className="input w-full"
            min={parameter.min}
            max={parameter.max}
            step="0.0001"
            defaultValue={parameter.default}
          />
        </fieldset>
      );

    case InputType.Toggle:
      return (
        <fieldset className="fieldset">
          <label>{parameter.name}</label>
          <input
            type="checkbox"
            name={name}
            className="toggle"
            defaultChecked={parameter.default}
          />
        </fieldset>
      );

    case InputType.Select:
      return (
        <fieldset className="fieldset">
          <select className="select select-success" name={name}>
            <option disabled value="">
              {parameter.name}
            </option>
            {parameter.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </fieldset>
      );
  }
}
