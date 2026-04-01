const traceBar = {
  x: ["Apples", "Bananas", "Oranges"],
  y: [10, 15, 7],
  type: "bar",
  marker: { color: "orange" },
};

const layoutBar = {
  title: "Fruit Counts",
  xaxis: { title: "Fruit" },
  yaxis: { title: "Count" },
};

Plotly.newPlot("myPlot", [traceBar], layoutBar);
