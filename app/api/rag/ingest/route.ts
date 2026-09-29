import { NextResponse } from "next/server";
import { globalVectorStore } from "@/lib/rag/vector-store";

export async function GET() {
  const docs = globalVectorStore.getDocuments();
  return NextResponse.json({ docs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category = "User Document", content, source = "Uploaded File" } = body;

    if (!title || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Title and non-empty content are required." },
        { status: 400 }
      );
    }

    const id = `doc-user-${Date.now()}`;
    const dateAdded = new Date().toISOString().split("T")[0];

    const ingested = globalVectorStore.addDocument({
      id,
      title,
      category,
      content,
      source,
      dateAdded,
    });

    return NextResponse.json({
      message: "Document successfully ingested into RAG vector store.",
      document: ingested,
      totalDocuments: globalVectorStore.getDocuments().length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("docId");

    if (!docId) {
      return NextResponse.json({ error: "docId parameter required." }, { status: 400 });
    }

    const removed = globalVectorStore.removeDocument(docId);
    if (!removed) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Document removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
