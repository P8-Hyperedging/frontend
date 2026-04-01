import { render_default_page } from "../components/default_templates.tsx";
import render_parameter_form from "../components/render_parameter_form.tsx";
import { getValue, hasValue } from "../optional.ts";
import { get_model_names, get_parameters } from "../services/hgnn_service.ts";

export async function train_a_model_page(_req: Request) {
  const parameters = await get_parameters("allset");
  const model_names = await get_model_names();

  if (!hasValue(parameters) || !hasValue(model_names)) {
    return <>"Python Server"</>;
  }
  return render_default_page(
    "Welcome",
    render_parameter_form(getValue(parameters), getValue(model_names)),
  );
}
