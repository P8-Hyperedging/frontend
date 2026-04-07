import { DefaultPage } from "../components/default_templates.tsx";
import render_parameter_form from "../components/render_parameter_form.tsx";
import { errorCodeCatImage } from "../components/responses.tsx";
import { getValue, hasValue } from "../optional.ts";
import { get_model_names, get_parameters } from "../services/hgnn_service.ts";

export async function TrainModel() {
  const parameters = await get_parameters("allset");
  const model_names = await get_model_names();

  if (!hasValue(parameters) || !hasValue(model_names)) {
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
      content={render_parameter_form(
        getValue(parameters),
        getValue(model_names),
      )}
    />
  );
}
