import { DefaultPage } from "../components/default_templates.tsx";
import ResultsTable from "../components/results_table.tsx";

export default function Results() {
  return (
    <DefaultPage
      title="Results Page"
      content={
        <>
          <div className="flex flex-col w-full items-center gap-4">
            <div className="w-3/4 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4 shadow-xl">
              <ResultsTable />
            </div>
          </div>
        </>
      }
    />
  );
}
