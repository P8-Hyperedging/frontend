import { render_default_page } from "../components/default_templates.tsx";

// deno-lint-ignore require-await
export async function home_page(_req: Request) {
  return render_default_page("Hello!", <h1>"Hello!"</h1>);
}
