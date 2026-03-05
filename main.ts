import {get_database_schema, TableInfo, TableRow} from "./services/schema_service.ts";
import { render_table } from "./templates/table_template.ts";
import { render_default_page } from "./templates/default_templates.ts";
import { serveFile } from "https://deno.land/std@0.211.0/http/file_server.ts";
import { exists } from "https://deno.land/std@0.211.0/fs/mod.ts";

Deno.serve(async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    try {
        if (pathname === "/schema") {
            const tableName = url.searchParams.get("table");

            if (tableName) {
                const schema = (await get_database_schema(tableName)) as TableRow[];
                return new Response(
                    render_default_page(`Schema: ${tableName}`, render_table(schema)),
                    { headers: { "content-type": "text/html" } }
                );
            } else {
                const tables = (await get_database_schema(null)) as TableInfo[];
                const linksHtml = tables
                    .map((t) => `<li><a href="/schema?table=${encodeURIComponent(t.table_name)}">${t.table_name}</a></li>`)
                    .join("");

                return new Response(
                    render_default_page("All Tables", `<h1>Available Tables</h1><ul>${linksHtml}</ul>`),
                    { headers: { "content-type": "text/html" } }
                );
            }
        }


        const filePath = pathname === "/" ? "/index.html" : pathname;
        const fullPath = `./public${filePath}`;

        // Check if the file exists
        if (await exists(fullPath)) {
            return await serveFile(req, fullPath);
        }

        // File doesn't exist, return default page
        return new Response(
            render_default_page(
                "Welcome",
                `<h1>Halloej og velkommen til vores projekt!</h1>`
            ),
            { headers: { "content-type": "text/html" } }
        );

    } catch (err) {
        console.error(err);
        return new Response("Server error: " + err, { status: 500 });
    }
});