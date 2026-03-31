import { JSX } from "preact";
import { Optional } from "./optional.ts";
import { renderToString } from "preact-render-to-string";
import { HtmlResponse } from "./components/responses.tsx";

export enum UrlMethod {
  GET = "GET",
  POST = "POST",
  UPDATE = "UPDATE",
}

type RouteHandler = (req: Request) => Promise<Response>;
type PageHandler = (req: Request) => Promise<JSX.Element>;

export class Router {
  routes: [string, UrlMethod, RouteHandler][];
  pages: [string, PageHandler][];

  constructor() {
    this.routes = [];
    this.pages = [];
  }

  async route(
    path: string,
    req: Request,
    method: UrlMethod,
  ): Promise<Optional<Response>> {
    const route = this.routes.find((r) => r[0] === path && r[1] === method);
    const page = this.pages.find((p) => p[0] === path && UrlMethod.GET === method);

    if (!route && !page) {
      return [null, false];
    }

    if (!page && route) {
      return [await route[2](req), true];
    }

    if (page) {
      return [HtmlResponse(renderToString(await page[1](req))), true];
    }

    return [null, false];
  }

  registerPage(path: string, func: PageHandler): void {
    this.pages.push([path, func]);
  }

  registerGetRoute(path: string, func: RouteHandler): void {
    this.routes.push([path, UrlMethod.GET, func]);
  }

  registerPostRoute(path: string, func: RouteHandler): void {
    this.routes.push([path, UrlMethod.POST, func]);
  }
}
