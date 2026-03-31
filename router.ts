import { JSX } from "preact";
import { Optional } from "./optional.ts";
import { renderToString } from "preact-render-to-string";
import { HtmlResponse } from "./components/responses.tsx";

export enum UrlMethod {
    GET = "GET",
    POST = "POST",
    UPDATE = "UPDATE"
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

    async route(path: string, req: Request, method: UrlMethod): Promise<Optional<Response>> {
        const r = this.routes.find(r => r[0] === path && r[1] === method);
        const p = this.pages.find(r => r[0] === path);

        if (p) {
            return [HtmlResponse(renderToString(await p[1](req))), true];
        }

        if (!r) {
            return [null, false];
        }

        return [await r[2](req), true];
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