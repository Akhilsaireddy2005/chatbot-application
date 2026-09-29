import { NextResponse } from "next/server";
import { globalVectorStore } from "@/lib/rag/vector-store";

export async function POST(req: Request) {
  try {
    const { query, topK = 3, threshold = 0.05 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required." }, { status: 400 });
    }

    const results = globalVectorStore.search(query, topK, threshold);
    const formattedContext = globalVectorStore.formatRAGContext(results);

    return NextResponse.json({
      query,
      matchCount: results.length,
      results: results.map((r) => ({
        docId: r.chunk.docId,
        docTitle: r.chunk.docTitle,
        category: r.chunk.category,
        score: r.score,
        content: r.chunk.content,
      })),
      formattedContext,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
