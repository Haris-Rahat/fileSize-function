import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // const res = new Response();
  // res.headers.set("Access-Control-Allow-Origin", "*");
  // res.headers.set(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, PUT, DELETE, OPTIONS"
  // );
  // res.headers.set(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type, Authorization"
  // );

  try {
    const { fileLink } = await req.json();
    if (!fileLink) {
      return new Response(JSON.stringify({ error: "No url provided!" }));
    }

    // Make a HEAD request to get the headers
    const response = await fetch(fileLink);
    const blob = await response.blob();

    // If the URL doesn't return a valid response, return an error
    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch URL: ${response.statusText}`,
        })
      );
    }

    // get file size from blob
    const fileSize = blob.size;

    if (!fileSize) {
      return new Response(
        JSON.stringify({ error: "Could not get file size!" })
      );
    }

    return new Response(JSON.stringify({ fileSize }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
};
