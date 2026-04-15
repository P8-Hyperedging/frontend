import { useEffect, useState } from "react";
import { DefaultPage } from "../components/default_templates.tsx";
import { errorCodeCatImage } from "../components/error_cats.tsx";
import { Parameter, SelectParameter } from "@shared/parameters.ts";
import ParameterForm from "../components/render_parameter_form.tsx";
import {ErrorPage} from "./errorpage";

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
    return (<ErrorPage errorMessage={errorMessage} errorCode={errorCode} />);
  }

  if (!parameters || !model_names) {
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
        <ParameterForm parameters={parameters} model_names={model_names} />
      }
    />
  );
}
