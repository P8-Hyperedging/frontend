function getJobIdFromURL() {
  const params = new URLSearchParams(globalThis.location.search);
  return params.get("job_id");
}

const jobId = getJobIdFromURL();
if (!jobId) {
  // deno-lint-ignore no-console
  console.error("No job ID found in URL!");
}

const backendOrigin = "http://127.0.0.1:8000";
const wsUrl = `${backendOrigin.replace(/^http/, "ws")}/ws?job_id=${encodeURIComponent(jobId ?? "")}`;
const socket = new WebSocket(wsUrl);

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

socket.onmessage = (event) => {
  let data;

  try {
    data = JSON.parse(event.data);
  } catch {
    data = { message: event.data };
  }

  if (data.job_id && data.job_id !== jobId) return;

  if (data.message === "TRAINING_COMPLETE") {
    appendLine(mockupDiv, "✅ Training finished!", "success"); // <-- pass "success"
    return;
  }

  appendLine(mockupDiv, data.message); // normal logs have no type
};
