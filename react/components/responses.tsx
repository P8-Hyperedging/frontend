import { renderToString } from "preact-render-to-string";
import { DefaultPage } from "./default_templates.tsx";

export function errorCodeCatImage(errorCode: number) {
  return (
    <img
      src={`https://http.cat/images/${errorCode}.jpg`}
      alt={`Error ${errorCode}`}
    />
  );
}

export function NoConnectionResponse(instanceWithoutConnection: string) {
  const def = (
    <DefaultPage
      title={`No connection to the ${instanceWithoutConnection}!`}
      content={
        <>
          No connection to the {instanceWithoutConnection}!
          {errorCodeCatImage(521)}
        </>
      }
    />
  );
  return HtmlResponse(renderToString(def));
}

export function NoPageResponse(path: string) {
  const def = (
    <DefaultPage
      title={`404 - Page Not Found`}
      content={
        <>
          The page "${path}" could not be found. {errorCodeCatImage(404)}
        </>
      }
    />
  );
  return HtmlResponse(renderToString(def));
}

export function RedirectResponse(path: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: path,
    },
  });
}

export function HtmlResponse(html: string) {
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}

export function JsonResponse<T>(body: T): Response {
  return new Response(
    JSON.stringify(
      body,
      (_, value) => typeof value === "bigint" ? value.toString() : value,
    ),
    {
      headers: { "content-type": "application/json" },
    },
  );
}
