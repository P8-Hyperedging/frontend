import { serveDir } from "jsr:@std/http/file-server";



Deno.serve(async (req) => {

  if (req.body) {
    const body = await req.text();
    console.log("Body:", body);
  }

  return serveDir(req, {
      fsRoot: "public",
      urlRoot: "",
    });
});