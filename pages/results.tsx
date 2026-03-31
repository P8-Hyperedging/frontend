/** @jsxImportSource https://esm.sh/preact */

import { render_default_page } from "../components/default_templates.tsx";
import { get_model_outputs } from "../services/model_output_service.ts";
import { render_results } from "../components/results_templates.tsx";

export async function results_page() {
  const model_outputs = await get_model_outputs();

  return render_default_page("Results", render_results(model_outputs));
}
