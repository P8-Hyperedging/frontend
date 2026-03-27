import {
  render_default_page,
} from "./templates/default_templates.ts";

export function NoConnectionResponse(instanceWithoutConnection: string) {
    const def = render_default_page
    (
        `No connection to the ${instanceWithoutConnection}!`, 
        `No connection to the ${instanceWithoutConnection}! 
        ${errorCodeCatImage(521)}`
    );
    return HtmlResponse(def);
}

export function NoPageResponse(path: string) {
    const def = render_default_page(
        `404 - Page Not Found`,
        `The page "${path}" could not be found.
        ${errorCodeCatImage(404)}`
    );
    return HtmlResponse(def);
}

export function RedirectResponse(path: string) {
  return new Response(null, {
    status: 302,
    headers: {
      "Location": path
    }
  });
}

export function HtmlResponse(html: string) {
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}

export function errorCodeCatImage(errorCode: number) {
    return `<image src="https://http.cat/images/${errorCode}.jpg">`;
}