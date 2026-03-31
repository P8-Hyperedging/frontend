import { getValue, hasValue } from "./optional.ts";
import { get_parameters } from "./services/hgnn_service.ts";
import {
  render_parameter_form_content,
} from "./components/render_parameter_form.tsx";
import { renderToString } from "preact-render-to-string";
import { render_running_jobs } from "./templates/running_jobs_template.ts";
import { render_default_string_page } from "./components/default_templates.tsx";
import { HtmlResponse, NoConnectionResponse } from "./components/responses.tsx";

// deno-lint-ignore require-await
export async function home_page(_req: Request) {
  return HtmlResponse(renderToString(render_default_string_page("Hello!", "Hello!")));
}


export async function parameter_form(req: Request) {
  const url = new URL(req.url);
  const model_name = url.searchParams.get("model") as string;
  const model_parameters = await get_parameters(model_name);
  if (!hasValue(model_parameters)) {
    return NoConnectionResponse("Python Server");
  }
  return HtmlResponse(
    renderToString(
      render_parameter_form_content(getValue(model_parameters), model_name),
    ),
  );
}


// deno-lint-ignore require-await
export async function running_jobs_page() {
  return HtmlResponse(
    renderToString(render_default_string_page("Running jobs", render_running_jobs())),
  );
}
