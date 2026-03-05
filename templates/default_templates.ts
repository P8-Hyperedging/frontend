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
    <link rel="stylesheet" type="text/css" href="css/default.css">
  </head>
  <body>
    ${render_toolbar() + content}
  </body>
  </html>
  `;
}

/**
 * 
 */
function render_toolbar() {
    return `
    <div class="toolbar">
        <button onclick="location.href='/'">Home</button>
        <button onclick="location.href='/schema'">Schema</button>
    </div>
    `;
}