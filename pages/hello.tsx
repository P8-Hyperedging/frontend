import { render_default_page } from "../components/default_templates.tsx";

export function HomePage(_req: Request) {
  return render_default_page("Hello!", <h1>"Hello!"</h1>);
}
