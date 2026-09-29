import { DEFAULT_KNOWLEDGE_DOCS, KnowledgeDoc } from "./default-docs";
import { chunkText, DocumentChunk } from "./chunker";
import { tokenize, computeTermFrequency, calculateCosineSimilarity } from "./embeddings";

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
}

export interface IngestedDoc extends KnowledgeDoc {
  chunkCount: number;
}

class VectorStore {
  private docs: Map<string, IngestedDoc> = new Map();
  private chunks: DocumentChunk[] = [];
  private vectors: Map<string, Record<string, number>> = new Map();

  constructor() {
    // Ingest default knowledge documents on creation
    DEFAULT_KNOWLEDGE_DOCS.forEach((doc) => {
      this.addDocument(doc);
    });
  }

  public addDocument(doc: KnowledgeDoc): IngestedDoc {
    const textChunks = chunkText(doc.content, doc.id, doc.title, doc.category);
    
    // Store doc metadata
    const ingested: IngestedDoc = {
      ...doc,
      chunkCount: textChunks.length,
    };
    this.docs.set(doc.id, ingested);

    // Remove existing chunks for this doc if updating
    this.chunks = this.chunks.filter((c) => c.docId !== doc.id);
    for (const chunk of textChunks) {
      this.chunks.push(chunk);
      const tokens = tokenize(`${chunk.docTitle} ${chunk.category} ${chunk.content}`);
      const tf = computeTermFrequency(tokens);
      this.vectors.set(chunk.id, tf);
    }

    return ingested;
  }

  public removeDocument(docId: string): boolean {
    if (this.docs.has(docId)) {
      this.docs.delete(docId);
      const chunksToRemove = this.chunks.filter((c) => c.docId === docId);
      chunksToRemove.forEach((c) => this.vectors.delete(c.id));
      this.chunks = this.chunks.filter((c) => c.docId !== docId);
      return true;
    }
    return false;
  }

  public getDocuments(): IngestedDoc[] {
    return Array.from(this.docs.values());
  }

  public search(query: string, topK: number = 3, threshold: number = 0.05): SearchResult[] {
    if (!query || query.trim().length === 0 || this.chunks.length === 0) return [];

    const queryTokens = tokenize(query);
    const queryVector = computeTermFrequency(queryTokens);

    const results: SearchResult[] = [];

    for (const chunk of this.chunks) {
      const chunkVector = this.vectors.get(chunk.id);
      if (!chunkVector) continue;

      let score = calculateCosineSimilarity(queryVector, chunkVector);

      // Boost title and category exact matches
      const titleLower = chunk.docTitle.toLowerCase();
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

      queryWords.forEach(word => {
        if (titleLower.includes(word)) score += 0.15;
      });

      if (score >= threshold) {
        results.push({ chunk, score: Math.min(1.0, score) });
      }
    }

    // Sort by descending score
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
  }

  public formatRAGContext(results: SearchResult[]): string {
    if (results.length === 0) return "";

    return results
      .map(
        (r, idx) =>
          `[Source ${idx + 1}]: "${r.chunk.docTitle}" (${r.chunk.category}) - Relevance Score: ${(r.score * 100).toFixed(0)}%\nContent: ${r.chunk.content}`
      )
      .join("\n\n---\n\n");
  }
}

// Global singleton instance
export const globalVectorStore = new VectorStore();
