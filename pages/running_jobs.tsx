import { render_default_page } from "../components/default_templates.tsx";

// deno-lint-ignore require-await
export async function running_jobs_page() {
  return render_default_page("Running jobs", render_running_jobs());
}

function render_running_jobs() {
  return (
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
      <script src="js/socket.js"></script>
    </>
  );
}
