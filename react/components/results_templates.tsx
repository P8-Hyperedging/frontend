import { useEffect, useRef, useState } from "react";
import { BoxPlotData, Model_output } from "@shared/model_output.ts";
import { DefaultPage } from "./default_templates.tsx";
import * as Plot from "@observablehq/plot";

export default function ResultsPage() {
  const [model_outputs, setModelOutputs] = useState<Model_output[] | null>(
    null,
  );
  const [box_plot_data, setBoxPlotData] = useState<BoxPlotData[] | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const model_res = await fetch("/api/get-model-outputs");
      const model_data = await model_res.json();
      setModelOutputs(model_data);

      const box_plot_res = await fetch("/api/get-box-plot-data");
      const box_plot_data = await box_plot_res.json();
      setBoxPlotData(box_plot_data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!box_plot_data) return;

    const plot = Plot.plot({
      x: { label: "Model Name" },
      y: { grid: true, inset: 6, label: "Validation Accuracy" },
      color: { scheme: "Observable10", legend: true },
      marks: [
        Plot.boxY(box_plot_data, {
          x: "model_name",
          y: "valid_acc",
          fill: "model_name",
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [box_plot_data]);

  if (!model_outputs || model_outputs.length === 0) {
    return (
      <DefaultPage
        title="Results"
        content={
          <>
            <div className="flex flex-col w-full items-center gap-4">
              <div className="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4 shadow-xl">
                <h1 className="text-xl">This is results page xD</h1>
              </div>
            </div>
          </>
        }
      />
    );
  }

  return (
    <DefaultPage
      title="Results"
      content={
        <>
          <div className="flex flex-col w-full items-center gap-4">
            <div className="w-auto flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4 shadow-xl">
              <h1 className="text-xl">This is results page xD</h1>

              <div ref={containerRef} />

              <h1></h1>
              {render_results_table(model_outputs)}
            </div>
          </div>
        </>
      }
    />
  );
}

function render_results_table(model_outputs: Model_output[]) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            {Object.keys(model_outputs[0]).map((key) => <th key={key}>{key}
            </th>)}
          </tr>
        </thead>

        <tbody>
          {model_outputs.map((row, index) => {
            return (
              <>
                <tr>
                  <th>{index + 1}</th>
                  <td>{row.job_id}</td>
                  <td>{row.training_time}</td>
                  <td>{row.total_runtime}</td>
                  <td>{row.seed}</td>
                  <td>{row.train_acc}</td>
                  <td>{row.valid_acc}</td>
                  <td>{row.test_acc}</td>

                  <td>
                    <div className="dropdown">
                      <div tabIndex={0} role="button" className="btn m-1">
                        Parameters
                      </div>
                      <div className="dropdown-content bg-base-300 rounded-box p-2 shadow-2xl">
                        <table className="table table-xs">
                          <tbody>
                            {Object.entries(row.parameters).map(
                              ([key, value]) => (
                                <tr>
                                  <td className="font-semibold">{key}</td>
                                  <td>{value}</td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>

                  <td>{row.model_name}</td>
                  <td>{row.id}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
      <div id="myPlot" className="w-1/2"></div>
      <script src="js/plots.js"></script>
    </>
  );
}
