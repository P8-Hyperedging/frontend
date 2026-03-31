/** @jsxImportSource https://esm.sh/preact */

import { renderToString } from "preact-render-to-string";
import { render_default_page } from "./default_templates.tsx";

export function errorCodeCatImage(errorCode: number) {
    return (
        <img src={`https://http.cat/images/${errorCode}.jpg`} alt={`Error ${errorCode}`} />
    );
}


export function NoConnectionResponse(instanceWithoutConnection: string) {
    const def = renderToString(render_default_page
    (
        `No connection to the ${instanceWithoutConnection}!`, 
        (<>No connection to the {instanceWithoutConnection}!
        {errorCodeCatImage(521)}</>)
    ));
    return HtmlResponse(def);
}

export function NoPageResponse(path: string) {
    const def = render_default_page(
        `404 - Page Not Found`,
        (<>The page "${path}" could not be found.
        {errorCodeCatImage(404)}</>));
    return HtmlResponse(renderToString(def));
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