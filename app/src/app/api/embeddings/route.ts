export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");

  const endpoint = `http://209.38.144.67:8000/embed_text?text=${prompt}`;
  const embedding_link = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: "",
  });

  const embedding = await embedding_link.json();

  return Response.json({ embedding: embedding });
}
