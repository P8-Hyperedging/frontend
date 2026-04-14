import { Optional } from "./optional.ts";

export enum UrlMethod {
  GET = "GET",
  POST = "POST",
  UPDATE = "UPDATE",
}

type RouteHandler = (req: Request) => Promise<Response>;

export class Router {
  routes: [string, UrlMethod, RouteHandler][];

  constructor() {
    this.routes = [];
  }

  async route(
    path: string,
    req: Request,
    method: UrlMethod,
  ): Promise<Optional<Response>> {
    const route = this.routes.find((r) => r[0] === path && r[1] === method);

    if (!route) {
      return [null, false];
    } else {
      return [await route[2](req), true];
    }
  }

  registerGetRoute(path: string, func: RouteHandler): void {
    this.routes.push([path, UrlMethod.GET, func]);
  }

  registerPostRoute(path: string, func: RouteHandler): void {
    this.routes.push([path, UrlMethod.POST, func]);
  }
}
