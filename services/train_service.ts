import { RedirectResponse } from "../reponses.ts";

export default async function post_train(req: Request) {
  const form = await req.formData();

  const data: Record<string, any> = {};
  for (const [key, value] of form.entries()) {
    data[key] = value;
  }

  const targetUrl = new URL(`http://127.0.0.1:5002/train/${data.model_name}`);

  const response = await fetch(targetUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  const job_id = json.job_id;

  return RedirectResponse(`/running-jobs?job_id=${job_id}`);
}
