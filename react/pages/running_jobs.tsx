import { useEffect } from "react";
import { DefaultPage } from "../components/default_templates.tsx";

export function RunningJobPage() {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "public/js/socket.js";
    script.async = true;

    document.body.appendChild(script);
  });
  return (
    <DefaultPage
      title="Running Jobs"
      content={
        <>
          <div className="flex flex-col w-full items-center gap-4">
            <div className="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
              <h1>running jobs</h1>
              <div className="mockup-code w-full h-96">
                <pre data-prefix="$" className="text-primary">
                  <code>Waiting for training to begin...</code>
                </pre>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
