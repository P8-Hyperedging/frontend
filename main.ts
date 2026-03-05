import { get_database_schema } from "./services/schema_service.ts";
import { render_table } from "./templates/table_template.ts";
import { render_default_page } from "./templates/default_templates.ts";

Deno.serve(async (req) => {
    const url = new URL(req.url);

    try {
        if (url.pathname === "/schema") {
            const tableName = url.searchParams.get("table");

            const schema = await get_database_schema(tableName);

            return new Response(
                render_default_page(`Schema`, render_table(schema)),
                { headers: { "content-type": "text/html" } }
            );
        }

        return new Response(
            render_default_page(
                "Welcome",
                `<body style="height: 95vh; width: 100vw; display: flex; justify-content: center; align-items: center">
                <h1>Halløj og velkommen til vores projekt!</h1>
            </body>`
            ),
            { headers: { "content-type": "text/html" } }
        );

    } catch (err) {
        console.error(err);
        return new Response("Database error: " + err, { status: 500 });
    }
});