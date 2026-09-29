import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { chatbotTools } from "@/lib/tools/definitions";
import { globalVectorStore } from "@/lib/rag/vector-store";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, ragEnabled = true, userApiKey = "" } = await req.json();

    const hasImage = messages.some((m: any) =>
      m.experimental_attachments?.some((a: any) => a.contentType?.startsWith("image/"))
    );
    const apiKey = (userApiKey || process.env.GROQ_API_KEY || "").trim();
    const googleApiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || userApiKey || "").trim();

    if (hasImage && (!googleApiKey || googleApiKey.includes("your_"))) {
      return new Response(
        JSON.stringify({ error: "Image analysis requires GOOGLE_GENERATIVE_AI_API_KEY in .env.local." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!hasImage && (!apiKey || apiKey.includes("your_groq"))) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY missing. Add it to .env.local or via the API Key drawer." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const model = hasImage
      ? createGoogleGenerativeAI({ apiKey: googleApiKey })("gemini-3.8-flash")
      : createGroq({ apiKey })("openai/gpt-oss-120b");

    // RAG retrieval
    let ragContext = "";
    let citations: any[] = [];
    const lastUser = [...messages].reverse().find((m: any) => m.role === "user");
    if (ragEnabled && lastUser && typeof lastUser.content === "string") {
      const hits = globalVectorStore.search(lastUser.content, 3, 0.04);
      if (hits.length > 0) {
        ragContext = globalVectorStore.formatRAGContext(hits);
        citations = hits.map((r) => ({
          docTitle: r.chunk.docTitle,
          category: r.chunk.category,
          score: r.score,
          snippet: r.chunk.content.slice(0, 200) + "...",
        }));
      }
    }

    const system = `You are a capable multimodal AI assistant. Be helpful, clear, and concise.

You can:
- Answer any question (coding, math, science, general knowledge)
- Analyze uploaded images (diagrams, photos, screenshots)
- Generate AI images — use generateImage tool when asked
- Search the web — use webSearch tool for current events or facts
- Show weather — use getWeather tool for any city
- Evaluate math — use calculateMath tool for calculations
- Create charts — use generateChart tool for data visualizations

${ragEnabled && ragContext ? `Knowledge Base (retrieved via RAG):\n${ragContext}\n\nGround your answer in the above sources when relevant.` : ""}`;

    const result = streamText({
      model,
      system,
      messages,
      tools: chatbotTools,
      maxSteps: 5,
    });

    const response = result.toDataStreamResponse({
      getErrorMessage: (err) => (err instanceof Error ? err.message : String(err)),
    });

    if (citations.length > 0) {
      response.headers.set("x-rag-citations", encodeURIComponent(JSON.stringify(citations)));
    }
    return response;
  } catch (err: any) {
    console.error("[chat error]", err?.message);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
