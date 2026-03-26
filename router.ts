import { Optional } from "./optional.ts";

export enum UrlMethod {
    GET="GET",
    POST="POST",
    UPDATE="UPDATE"
}

export class Router {

    routes: [string, string, (url: URL) => Promise<Response>][]

    constructor() {
        this.routes = [];
    }

    async route(path: string, url: URL, method: string): Promise<Optional<Response>> {
        const r = this.routes.find(r => r[0] == path && r[1] == method);
        if (r == null) {
            return Promise.resolve([null, false]);
        }
        return [(await r[2](url)), true];
    }
    
    registerGetRoute(path: string, func: (url: URL) => Promise<Response>): void {
        this.routes.push([path, UrlMethod.GET, func]);
    }

    registerPostRoute(path: string, func: (url: URL) => Promise<Response>): void {
        this.routes.push([path, UrlMethod.POST, func]);
    }
}