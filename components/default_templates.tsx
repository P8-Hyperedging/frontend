import { JSX } from "preact";

/**
 * Get a default page
 * @param title title of the page
 * @param content content of the page
 */
export function render_default_page(title: string, content: JSX.Element) {
  return (
    <>
      <html data-theme="cupcake">
        <head>
          <title>{title}</title>
          <link rel="stylesheet" type="text/css" href="css/output.css" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js">
          </script>
          <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js">
          </script>
          <script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
          <script src="https://cdn.plot.ly/plotly-3.4.0.min.js"></script>
        </head>
        <body class="bg-base-100 ">
          <div class="flex flex-col w-full flex justify-center items-center">
            {[render_toolbar(), content]}
          </div>
        </body>
      </html>
    </>
  );
}

/** */
function render_toolbar() {
  return (
    <>
      <div class="navbar bg-base-200 shadow-sm">
        <div class="navbar-start">
          <a class="btn btn-ghost text-xl" href="/">
            Hyperedging
          </a>
        </div>
        <div class="navbar-center hidden lg:flex">
          <a class="btn btn-ghost" href="/">
            <i class="material-icons">home</i>Home
          </a>
          <a class="btn btn-ghost" href="/train">
            <i class="material-icons">smart_toy</i>Train
          </a>
          <a class="btn btn-ghost" href="/schema">
            <i class="material-icons">schema</i>Schema
          </a>
          <a class="btn btn-ghost" href="/results">
            <i class="material-icons">analytics</i>Results
          </a>
        </div>
        <div class="navbar-end">
          <div class="dropdown">
            <div tabindex={0} role="button" class="btn m-1">
              Theme
              <svg
                width="12px"
                height="12px"
                class="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z">
                </path>
              </svg>
            </div>
            <ul
              tabindex={-1}
              class="dropdown-content bg-base-300 rounded-box z-1 w-auto p-2 shadow-2xl"
            >
              {render_theme()}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function render_theme() {
  const themes = ["light", "dark", "cupcake"];

  return themes.map((theme) => (
    <li key={theme}>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label={theme}
        value={theme}
        data-set-theme={theme}
        data-act-class="ACTIVECLASS"
      />
    </li>
  ));
}

export function render_heading(heading: string) {
  return <h1 class="text-xl text-base-content p-8">{heading}</h1>;
}
