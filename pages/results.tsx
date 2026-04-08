import { DefaultPage } from "../components/default_templates.tsx";
import { get_model_outputs } from "../services/model_output_service.ts";
//import { ResultsPage } from "../components/results_templates.tsx";

export async function results_page() {
  const model_outputs = await get_model_outputs();

  return (
    <DefaultPage
      title="Results"
      content={<h1>fuck</h1> /*<ResultsPage model_outputs={model_outputs} />*/}
    />
  );
}
