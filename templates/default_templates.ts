/**
 * Get a default page
 * @param title title of the page
 * @param content content of the page
 */
export function render_default_page(title: string, content: string): string {
    return `
  <!DOCTYPE html>
  <html data-theme="dark">
  <head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="css/output.css">
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
    <div class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <a class="btn btn-ghost text-xl">Hyperedging</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <a class="btn btn-ghost" href="/">Home</a>
        <a class="btn btn-ghost" href="/schema">Schema</a>
      </div>
      <div class="navbar-end">
      </div>
    </div>
    `;
}
