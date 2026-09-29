export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  category: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export function chunkText(
  text: string,
  docId: string,
  docTitle: string,
  category: string,
  chunkSize: number = 500,
  overlap: number = 100
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  if (!text || text.trim().length === 0) return chunks;

  const cleanedText = text.replace(/\r\n/g, "\n");
  let start = 0;
  let chunkIdx = 0;

  while (start < cleanedText.length) {
    let end = start + chunkSize;

    if (end < cleanedText.length) {
      // Find clean sentence or line break boundary near the end
      const lastPeriod = cleanedText.lastIndexOf(".", end);
      const lastNewline = cleanedText.lastIndexOf("\n", end);
      const boundary = Math.max(lastPeriod, lastNewline);

      if (boundary > start + chunkSize / 2) {
        end = boundary + 1;
      }
    } else {
      end = cleanedText.length;
    }

    const chunkContent = cleanedText.slice(start, end).trim();

    if (chunkContent.length > 0) {
      chunks.push({
        id: `${docId}-chunk-${chunkIdx}`,
        docId,
        docTitle,
        category,
        content: chunkContent,
        startIndex: start,
        endIndex: end,
      });
      chunkIdx++;
    }

    if (end >= cleanedText.length) break;

    start = Math.max(start + 1, end - overlap);
  }

  return chunks;
}
