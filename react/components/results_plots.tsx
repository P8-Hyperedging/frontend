import { useEffect, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";
import { BoxPlotData, HyperParameterSeries } from "@shared/model_output.ts";

export default function ResultsPlots() {
  const [box_plot_data, setBoxPlotData] = useState<BoxPlotData[] | null>(null);
  const [hyperparameter_data, setHyperparameterData] = useState<
    HyperParameterSeries[] | null
  >(null);
  const boxPlotRef = useRef<HTMLDivElement>(null);
  const hiddenLayerRef = useRef<HTMLDivElement>(null);
  const learningRateRef = useRef<HTMLDivElement>(null);
  const weightDecayRef = useRef<HTMLDivElement>(null);
  const epochsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const box_plot_res = await fetch("/api/get-box-plot-data");
      const box_plot_data = await box_plot_res.json();
      setBoxPlotData(box_plot_data);

      const hyperparameter_res = await fetch("/api/get-hyperparameter-data");
      const hyperparameter_data = await hyperparameter_res.json();
      setHyperparameterData(hyperparameter_data);
    }

    fetchData();
  }, []);

  // Box plot
  useEffect(() => {
    if (!boxPlotRef.current) return;

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

    boxPlotRef.current.append(plot);
    return () => plot.remove();
  }, [box_plot_data]);

  useEffect(() => {
    if (
      !hiddenLayerRef.current ||
      !learningRateRef.current ||
      !weightDecayRef.current ||
      !epochsRef.current
    ) {
      return;
    }

    if (
      !hyperparameter_data ||
      !hyperparameter_data[0] ||
      !hyperparameter_data[0]?.data
    ) {
      return;
    }

    const hiddenLayerPlot = Plot.plot({
      x: { label: "Hidden Layer Size" },
      y: { grid: true, inset: 6, label: "Validation Accuracy" },
      color: { scheme: "Observable10", legend: true },
      marks: [
        Plot.lineY(hyperparameter_data[0].data, {
          x: "value",
          y: "avg_valid_acc",
          marker: true,
          stroke: "red",
        }),
      ],
    });

    const learningRatePlot = Plot.plot({
      x: { label: "Learning Rate" },
      y: { grid: true, inset: 6, label: "Validation Accuracy" },
      color: { scheme: "Observable10", legend: true },
      marks: [
        Plot.lineY(hyperparameter_data[1]?.data, {
          x: "value",
          y: "avg_valid_acc",
          marker: true,
          stroke: "blue",
        }),
      ],
    });

    const weightDecayPlot = Plot.plot({
      x: { label: "Weight Decay" },
      y: { grid: true, inset: 6, label: "Validation Accuracy" },
      color: { scheme: "Observable10", legend: true },
      marks: [
        Plot.lineY(hyperparameter_data[2]?.data, {
          x: "value",
          y: "avg_valid_acc",
          marker: true,
          stroke: "orange",
        }),
      ],
    });

    const epochsPlot = Plot.plot({
      x: { label: "Epochs" },
      y: { grid: true, inset: 6, label: "Validation Accuracy" },
      color: { scheme: "Observable10", legend: true },
      marks: [
        Plot.lineY(hyperparameter_data[3].data, {
          x: "value",
          y: "avg_valid_acc",
          marker: true,
          stroke: "green",
        }),
      ],
    });

    hiddenLayerRef.current.append(hiddenLayerPlot);
    learningRateRef.current.append(learningRatePlot);
    weightDecayRef.current.append(weightDecayPlot);
    epochsRef.current.append(epochsPlot);

    return () => {
      hiddenLayerPlot.remove();
      learningRatePlot.remove();
      weightDecayPlot.remove();
      epochsPlot.remove();
    };
  }, [hyperparameter_data]);

  return (
    <>
      <div className="m-4">
        <h1 className="text-xl">Box plot of validation accuracy per model</h1>
        <div ref={boxPlotRef} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Hidden Layer Size</h3>
          <div ref={hiddenLayerRef} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Learning Rate</h3>
          <div ref={learningRateRef} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Weight Decay</h3>
          <div ref={weightDecayRef} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Epochs</h3>
          <div ref={epochsRef} />
        </div>
      </div>
    </>
  );
}
