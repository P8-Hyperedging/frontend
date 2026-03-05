import { serveDir } from "jsr:@std/http/file-server";
import { Client } from "jsr:@db/postgres";

const client = new Client({
    user: Deno.env.get("DATABASE_USER"),
    password: Deno.env.get("DATABASE_PASSWORD"),
    database: "yelp",
    hostname: Deno.env.get("DATABASE_IP"),
    port: 5432,
});

await client.connect();

/* ---------- HTML Helpers ---------- */

function page(title: string, content: string) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        background: #f9fafb;
      }
      h1 { margin-bottom: 20px; }
      a { text-decoration: none; color: #2563eb; }
      table {
        border-collapse: collapse;
        width: 100%;
        max-width: 1000px;
        background: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }
      th, td {
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }
      th {
        background: #f3f4f6;
        font-weight: 600;
      }
      tr:hover { background: #f9fafb; }
      .back { margin-bottom: 20px; display: inline-block; }
    </style>
  </head>
  <body>
    ${content}
  </body>
  </html>
  `;
}

function renderTableList(rows: any[]) {
    return `
    <h1>Database Tables</h1>
    <table>
      <thead>
        <tr>
          <th>Table</th>
          <th>Approx Rows</th>
          <th>Total Size</th>
        </tr>
      </thead>
      <tbody>
        ${rows
        .map(
            (r) => `
            <tr>
              <td>
                <a href="/schema?table=${r.relname}">
                  ${r.relname}
                </a>
              </td>
              <td>${Number(r.reltuples).toLocaleString()}</td>
              <td>${r.total_size}</td>
            </tr>
          `
        )
        .join("")}
      </tbody>
    </table>
  `;
}

function renderSchema(rows: any[], tableName: string) {
    return `
    <a class="back" href="/schema">← Back to tables</a>
    <h1>${tableName} Schema</h1>
    <table>
      <thead>
        <tr>
          <th>Column</th>
          <th>Type</th>
          <th>Nullable</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        ${rows
        .map(
            (r) => `
            <tr>
              <td>${r.column_name}</td>
              <td>${r.data_type}</td>
              <td>${r.is_nullable}</td>
              <td>${r.column_default ?? ""}</td>
            </tr>
          `
        )
        .join("")}
      </tbody>
    </table>
  `;
}

/* ---------- Server ---------- */

Deno.serve(async (req) => {
    const url = new URL(req.url);

    try {
        if (url.pathname === "/schema") {
            const tableName = url.searchParams.get("table");

            // 🔎 If a specific table is requested → show schema
            if (tableName) {
                const schemaResult = await client.queryObject(
                    `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
          `,
                    [tableName]
                );

                return new Response(
                    page(
                        `${tableName} Schema`,
                        renderSchema(schemaResult.rows, tableName)
                    ),
                    { headers: { "content-type": "text/html" } }
                );
            }

            // 📋 Otherwise list all user tables with sizes
            const tables = await client.queryObject(
                `
        SELECT
          c.relname,
          c.reltuples,
          pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'r'
          AND n.nspname = 'public'
        ORDER BY c.relname;
        `
            );

            return new Response(
                page("Tables", renderTableList(tables.rows)),
                { headers: { "content-type": "text/html" } }
            );
        }

        return serveDir(req, {
            fsRoot: "public",
            urlRoot: "",
        });

    } catch (err) {
        console.error(err);
        return new Response("Database error: " + err, { status: 500 });
    }
});