export function RedirectResponse(path: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: path,
    },
  });
}

export function JsonResponse<T>(body: T): Response {
  return new Response(
    JSON.stringify(
      body,
      (_, value) => typeof value === "bigint" ? value.toString() : value,
    ),
    {
      headers: { "content-type": "application/json" },
    },
  );
}

export function NotFound(message = "Not Found"): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function ErrorResponse(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function NoConnectionResponse(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 521,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
