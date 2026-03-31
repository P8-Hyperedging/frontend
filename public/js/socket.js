const socket = io("http://localhost:5002");

function getJobIdFromURL() {
  const params = new URLSearchParams(globalThis.location.search);
  return params.get("job_id");
}

const jobId = getJobIdFromURL();
if (!jobId) {
  // deno-lint-ignore no-console
  console.error("No job ID found in URL!");
}

// Subscribe to the job on the server
socket.emit("subscribe_job", { job_id: jobId });

function appendLine(container, text, type) {
  const pre = document.createElement("pre");
  pre.setAttribute("data-prefix", ">");

  // Add class if type is specified
  if (type === "success") {
    pre.classList.add("text-success");
  }

  const code = document.createElement("code");
  code.textContent = text;
  pre.appendChild(code);
  container.appendChild(pre);
  container.scrollTop = container.scrollHeight;
}

const mockupDiv = document.querySelector(".mockup-code");
if (!mockupDiv) {
  // deno-lint-ignore no-console
  console.error("No .mockup-code div found!");
}

// Listen for updates from the server
socket.on("job_update", (data) => {
  if (data.job_id !== jobId) return;

  if (data.message === "TRAINING_COMPLETE") {
    appendLine(mockupDiv, "✅ Training finished!", "success"); // <-- pass "success"
    return;
  }

  appendLine(mockupDiv, data.message); // normal logs have no type
});
