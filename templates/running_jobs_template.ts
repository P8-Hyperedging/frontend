export function render_running_jobs(): string {
  return `
  <div class="flex flex-col w-full items-center gap-4">
    <div class="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
      <h1>running jobs</h1>
      <div class="mockup-code w-full h-96">
        <pre data-prefix="$" class="text-primary"><code>Waiting for training to begin...</code></pre>
      </div>
    </div>
  </div>
  <script src="js/socket.js"></script>
  `;
}
