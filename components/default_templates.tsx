import type { ReactElement } from "react";

/**
 * Get a default page
 * @param title title of the page
 * @param content content of the page
 */
export function render_default_page(title: string, content: ReactElement) {
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
        <body className="bg-base-100 ">
          <div className="flex flex-col w-full flex justify-center items-center">
            <Toolbar />
          </div>
          {content}
        </body>
      </html>
    </>
  );
}

function Toolbar() {
  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl" href="/">
          Hyperedging
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <a className="btn btn-ghost" href="/">
          <i className="material-icons">home</i>Home
        </a>
        <a className="btn btn-ghost" href="/train">
          <i className="material-icons">smart_toy</i>Train
        </a>
        <a className="btn btn-ghost" href="/schema">
          <i className="material-icons">schema</i>Schema
        </a>
        <a className="btn btn-ghost" href="/results">
          <i className="material-icons">analytics</i>Results
        </a>
      </div>
      <div className="navbar-end">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z">
              </path>
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="dropdown-content bg-base-300 rounded-box z-1 w-auto p-2 shadow-2xl"
          >
            <Theme_options />
          </ul>
        </div>
      </div>
    </div>
  );
}

function Theme_options() {
  const themes = ["light", "dark", "cupcake"];
  return themes.map((theme) => (
    <li key={theme}>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label={theme}
        value={theme}
        data-set-theme={theme}
        data-act-class="ACTIVECLASS"
      />
    </li>
  ));
}

export function render_heading(heading: string) {
  return <h1 className="text-xl text-base-content p-8">{heading}</h1>;
}
