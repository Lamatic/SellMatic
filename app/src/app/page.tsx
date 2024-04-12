"use client";

import { CornerDownLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pinecone } from "@pinecone-database/pinecone";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [cart, setCart] = useState<any>([]);
  const [flow2, setFlow2] = useState(false);
  const [genratedImage, setGenratedImage] = useState<any>(null);
  const [taskId, setTaskId] = useState<any>(null);
  const [upscaleImage, setUpscaleImage] = useState<any>(null);
  const [improvePrompt, setImprovePrompt] = useState<any>(null);

  function cleanAll() {
    setFlow2(false);
    setUpscaleImage(null);
    setPrompt("");
    setProductImage(null);
    setGenratedImage(null);

    setLoading(false);
  }

  const apikey = process.env.NEXT_PUBLIC_PINECONE_KEY as string;

  const pc = new Pinecone({
    apiKey: apikey,
  });

  async function findProduct() {
    if (prompt === "") {
      return;
    }
    setLoading(true);

    const index = pc.Index("test2");

    const embedding_fetch = await fetch(`/api/embeddings?prompt=${prompt}`);
    const embedding = (await embedding_fetch.json()) as any;

    const index_response = await index.query({
      vector: embedding?.embedding,
      topK: 1,
      includeMetadata: true,
    });

    setProductImage(index_response.matches[0].metadata?.image_url);
    setMessages([
      ...messages,
      { type: "image", image: index_response.matches[0].metadata?.image_url },
    ]);
    setLoading(false);
    return;
  }

  function addToCart() {
    if (upscaleImage) {
      setMessages([...messages, { type: "text", text: "Added to cart!!" }]);
      setCart([...cart, { image: upscaleImage }]);
      cleanAll();
      return;
    }
    setMessages([...messages, { type: "text", text: "Added to cart!!" }]);
    setCart([...cart, { image: productImage }]);
    setPrompt("");
    setProductImage(null);
  }

  async function generateImage() {
    setFlow2(true);
    setLoading(true);
    setMessages([
      ...messages,
      { type: "text", text: "Genrating something awsome!!" },
    ]);

    const endpoint = "https://api.midjourneyapi.xyz/mj/v2/imagine";
    const headers = {
      "X-API-KEY": process.env.NEXT_PUBLIC_X_API_KEY as string,
      "Content-Type": "application/json",
    };

    const data = {
      prompt: `${productImage} ${prompt}, ${improvePrompt}`  ,
      process_mode: "fast",
    };

    // Send the request to generate image
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image. Status: ${response.status}`);
    }

    const responseData = await response.json();
    const task_id = responseData.task_id;

    // Wait for 60 seconds
    await new Promise((resolve) => setTimeout(resolve, 60000));

    const endpoint2 = "https://api.midjourneyapi.xyz/mj/v2/fetch";
    const data2 = {
      task_id: task_id,
    };

    // Fetch image
    let fetch_response = await fetch(endpoint2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data2),
    });

    let fetch_data = await fetch_response.json();

    // Wait while task is processing
    while (fetch_data.status === "processing") {
      await new Promise((resolve) => setTimeout(resolve, 20000));
      fetch_response = await fetch(endpoint2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data2),
      });
      fetch_data = await fetch_response.json();
    }

    // Image URL
    const image = fetch_data.task_result.image_url;
    setGenratedImage(image);
    setTaskId(fetch_data.task_id);
    setMessages([...messages, { type: "image", image: image }]);

    setLoading(false);
  }

  async function upscale(index: number) {
    setLoading(true);
    const endpoint = "https://api.midjourneyapi.xyz/mj/v2/upscale";
    const headers = {
      "X-API-KEY": process.env.NEXT_PUBLIC_X_API_KEY as string,
      "Content-Type": "application/json",
    };

    const data = {
      origin_task_id: taskId,
      index: index.toString(),
    };

    // Send the request to upscale the image
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to upscale image. Status: ${response.status}`);
    }

    const upscale_gen_req_output = await response.json();
    let task_id_upscale = upscale_gen_req_output.task_id;

    // Wait for 30 seconds
    await new Promise((resolve) => setTimeout(resolve, 30000));

    const endpoint2 = "https://api.midjourneyapi.xyz/mj/v2/fetch";
    const data2 = {
      task_id: task_id_upscale,
    };

    // Fetch the upscaled image
    let fetch_response = await fetch(endpoint2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data2),
    });
    let fetch_data = await fetch_response.json();

    // Wait while task is processing
    while (fetch_data.status === "processing") {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      fetch_response = await fetch(endpoint2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data2),
      });
      fetch_data = await fetch_response.json();
    }

    // Get the URL of the upscaled image
    const image_url = fetch_data.task_result.image_url;

    setUpscaleImage(image_url);
    setMessages([...messages, { type: "image", image: image_url }]);
    // setFlow2(false);
    setGenratedImage(null);

    setLoading(false);
  }

  return (
    <div className="grid h-screen max-h-screen w-full">
      <div className="flex flex-col max-h-screen">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <div className="flex items-center gap-3">
            <p className="font-bold text-2xl">SellMatic</p>
            <a href={"https://lamatic.ai"} className="text-red-600" target="_blank">by Lamatic.ai</a>
          </div>
        </header>
        <main className="grid flex-1 flex-grow gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6 h-full">
              <fieldset className="h-full gap-6 rounded-lg border p-4 w-full">
                <legend className="-ml-1 px-1 font-medium">Cart</legend>
                {cart.length > 0 ? (
                  <div className="flex gap-2 flex-col">
                    {cart.map((item: any) => {
                      return (
                        <div className="h-60 w-full rounded-lg border p-3 flex items-center justify-center overflow-hidden">
                          <img className=" h-full" src={item.image} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 w-full flex justify-center items-center">
                    <p className="font-semibold">Your cart is empty</p>
                  </div>
                )}
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-10 top-3">
              Output
            </Badge>
            <div className="flex-1 h-full items-end pb-5 overflow-y-scroll">
              {messages.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {messages.map((message: any) => {
                    if (message.type === "image") {
                      return (
                        <div className="h-96 w-96 rounded-lg border p-3 flex items-center justify-center">
                          <img className="w-full" src={message.image} />
                        </div>
                      );
                    }
                    if (message.type === "text") {
                      return (
                        <div className="p-2 border rounded-lg w-fit">
                          <p className="font-medium text-sm">{message.text}</p>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : null}
            </div>
            <div className="relative overflow-hidden min-h-36 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
              {!productImage ? (
                <Textarea
                  id="message"
                  placeholder="Type about your product here..."
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                  onChange={(e) => setPrompt(e.currentTarget.value)}
                />
              ) : (
                <>
                  {flow2 && genratedImage ? (
                    <>
                      {genratedImage && !upscaleImage ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 p-3">
                            <p className="mr-3">Select which you like most: </p>
                            <Button
                              size={"xs"}
                              onClick={() => upscale(1)}
                              disabled={isLoading}
                            >
                              1
                            </Button>
                            <Button
                              size={"xs"}
                              onClick={() => upscale(2)}
                              disabled={isLoading}
                            >
                              2
                            </Button>
                            <Button
                              size={"xs"}
                              onClick={() => upscale(3)}
                              disabled={isLoading}
                            >
                              3
                            </Button>
                            <Button
                              size={"xs"}
                              onClick={() => upscale(4)}
                              disabled={isLoading}
                            >
                              4
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 w-full" />
                      )}
                    </>
                  ) : (
                    <>
                      {!flow2 ? (
                        <div className="min-h-12 p-3 flex flex-col gap-2">
                          <p>Is this the product you are looking for?</p>
                          <div className="flex items-center gap-2">
                            <p className="mr-3">Should we add this to cart?</p>
                            <Button size={"xs"} onClick={addToCart}>
                              Yes!
                            </Button>
                            <Button
                              size={"xs"}
                              variant={"outline"}
                              onClick={() => setFlow2(true)}
                            >
                              NO, Genrate something new
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </>
              )}
              {flow2 && genratedImage === null ? (
                <Textarea
                  id="message"
                  placeholder="Type about how can we improve this product..."
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                  onChange={(e) => setImprovePrompt(e.currentTarget.value)}
                />
              ) : null}
              {flow2 && upscaleImage ? (
                <div className="min-h-12 p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="mr-3">Should we add this to cart?</p>
                    <Button size={"xs"} onClick={addToCart}>
                      Yes!
                    </Button>
                    <Button size={"xs"} variant={"outline"} onClick={cleanAll}>
                      NO, Start again :{"("}
                    </Button>
                  </div>
                </div>
              ) : null}
              <div className="flex items-center p-3 pt-0">
                {isLoading && productImage === null ? (
                  <div className="flex gap-2 items-center">
                    <p>Finding best product for the best</p>{" "}
                    <LoadingSpinner size={15} />
                  </div>
                ) : null}
                {isLoading && flow2 && !genratedImage ? (
                  <div className="flex gap-2 items-center">
                    <p>
                      Genrating something new{" "}
                      <span className="text-muted-foreground">
                        (takes 1-2mins)
                      </span>
                    </p>{" "}
                    <LoadingSpinner size={15} />
                  </div>
                ) : null}
                {isLoading && flow2 && genratedImage ? (
                  <div className="flex gap-2 items-center">
                    <p>
                      Upscaling your choice{" "}
                      <span className="text-muted-foreground">
                        (takes 1-2mins)
                      </span>
                    </p>{" "}
                    <LoadingSpinner size={15} />
                  </div>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  className="ml-auto gap-1.5"
                  onClick={() => {
                    if (flow2) {
                      generateImage();
                    } else {
                      findProduct();
                    }
                  }}
                  disabled={isLoading}
                >
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
