import { useEffect, useState } from "react";
import { DefaultPage } from "../components/default_templates.tsx";
import { errorCodeCatImage } from "../components/error_cats.tsx";
import { Parameter, SelectParameter } from "@shared/parameters.ts";
import ParameterForm from "../components/render_parameter_form.tsx";

export function TrainModel() {
  const [parameters, setParameters] = useState<Parameter[] | null>(null);
  const [model_names, setModelNames] = useState<SelectParameter | null>(null);
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
      const param_data = await params_res.json();
      setParameters(param_data);

      const model_names_res = await fetch("/api/get-model-names");
      if (!model_names_res.ok) {
        setErrorCode(model_names_res.status);
        const error_message = await model_names_res.json();
        setErrorMessage(error_message.error);
      }
      const model_names_data = await model_names_res.json();
      setModelNames(model_names_data);
    }

    fetchData();
  }, []);

  if (errorCode !== null && errorMessage !== null) {
    return (
      <DefaultPage
        title="No connection to the Python server!"
        content={
          <div className="flex flex-col w-full items-center gap-4">
            <div className="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
              <h1 className="text-xl">{errorMessage}</h1>
              {errorCodeCatImage(errorCode)}
            </div>
          </div>
        }
      />
    );
  }

  if (!parameters || !model_names) {
    return (
      <DefaultPage
        title="No connection to the Python server!"
        content={
          <div className="flex flex-col w-full items-center gap-4">
            <div className="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
            </div>
          </div>
        }
      />
    );
  }
  return (
    <DefaultPage
      title="Train"
      content={
        <ParameterForm parameters={parameters} model_names={model_names} />
      }
    />
  );
}
