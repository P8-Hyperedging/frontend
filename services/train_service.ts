import { log } from "node:console";
import { RedirectResponse } from "../reponses.ts";


export default async function post_train(req: Request) {
  const form = await req.formData();

  const data: Record<string, any> = {};
  for (const [key, value] of form.entries()) {
    data[key] = value;
  }

  const incomingUrl = new URL(req.url);
  const targetUrl = new URL(`http://127.0.0.1:5002${incomingUrl.pathname}`);

  const response = await fetch(targetUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(await response.json())

  return RedirectResponse("/running-jobs");
}