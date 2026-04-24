import { DefaultPage } from "../components/default_templates.tsx";
import ResultsTable from "../components/results_table.tsx";

export default function Results() {
  return (
    <DefaultPage
      title="Results Page"
      width="w-3/4"
      content={
        <>
          <ResultsTable />
        </>
      }
    />
  );
}
