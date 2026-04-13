import { useEffect, useState } from "react";
import { DefaultPage } from "../components/default_templates.tsx";
import { errorCodeCatImage } from "../components/responses.tsx";
import { Parameter, SelectParameter } from "../../shared/parameters.ts";
import ParameterForm from "../components/render_parameter_form.tsx";

export function TrainModel() {
  const [parameters, setParameters] = useState<Parameter[] | null>(null);
  const [model_names, setModelNames] = useState<SelectParameter | null>(null);
  useEffect(() => {
    async function fetchData() {
      const params_res = await fetch("/api/get-parameters?model_name=allset");
      const param_data = await params_res.json();
      setParameters(param_data);

      const model_names_res = await fetch("/api/get-model-names");
      const model_names_data = await model_names_res.json();
      setModelNames(model_names_data);
    }

    fetchData();
  }, []);

  if (!parameters || !model_names) {
    return (
      <DefaultPage
        title="No connection to the Python server!"
        content={
          <>
            No connection to the python server!
            {errorCodeCatImage(521)}
          </>
        }
      />
    );
  }
  return (
    <DefaultPage
      title="Welcome"
      content={
        <ParameterForm parameters={parameters} model_names={model_names} />
      }
    />
  );
}
