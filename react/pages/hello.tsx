import { DefaultPage } from "../components/default_templates.tsx";

export function HomePage(_req: Request) {
  return <DefaultPage title="Hello!" content={<h1>Hello!</h1>} />;
}
