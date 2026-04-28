import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultPage } from "../components/default_templates.tsx";
import { TrainModel } from "./train.tsx";
import { RenderSchema } from "./schema.tsx";
import { RunningJobPage } from "./running_jobs.tsx";
import Results from "./results.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<DefaultPage title="Hello!" content={<h1>Hello!</h1>} />}
      />
      <Route path="/train" element={<TrainModel />} />
      <Route path="/schema" element={<RenderSchema />} />
      <Route path="/results" element={<Results />} />
      <Route path="/running-jobs" element={<RunningJobPage />} />
    </Routes>
  </BrowserRouter>,
);
