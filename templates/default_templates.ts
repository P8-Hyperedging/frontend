/**
 * Get a default page
 * @param title title of the page
 * @param content content of the page
 */
export function render_default_page(title: string, content: string): string {
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