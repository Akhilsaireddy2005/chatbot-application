export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  source: string;
  dateAdded: string;
}

export const DEFAULT_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: "doc-rag-arch-1",
    title: "Multimodal Retrieval-Augmented Generation (RAG) Architecture",
    category: "Architecture",
    dateAdded: "2026-09-01",
    source: "System Knowledge Base",
    content: `Retrieval-Augmented Generation (RAG) combines dense vector retrieval mechanisms with large language models (LLMs).
Key components of RAG:
1. Ingestion & Document Chunking: Raw documents (PDF, Markdown, TXT) are parsed and divided into overlapping chunks (e.g. 500 characters with 100 character overlap) to preserve contextual boundaries.
2. Vector Embeddings: Text chunks are converted into numerical high-dimensional vector representations using embedding models.
3. Similarity Search: User queries are embedded into the same vector space, and cosine similarity or Euclidean distance is calculated to find the top-K relevant chunks.
4. Multimodal RAG Extension: Multimodal RAG processes both image inputs (charts, diagrams, code screenshots) and text documents. Images are analyzed via vision models (e.g. Llama 3.2 Vision, Gemini 2.0 Flash) to extract textual semantics, which are indexed alongside document text.
5. Context Grounding & Citation: Retrieved chunks are injected directly into the LLM system prompt as context. The model generates responses grounded strictly in the provided sources and emits citations.`
  },
  {
    id: "doc-vercel-ai-sdk-2",
    title: "Vercel AI SDK & Tool Calling Mechanics",
    category: "Developer Guide",
    dateAdded: "2026-09-15",
    source: "Vercel AI SDK Docs",
    content: `Vercel AI SDK (v4) provides a unified TypeScript interface for LLM streaming, multimodal vision, tool calling, and Generative UI.
Key Functions & APIs:
- streamText: Core function to stream LLM responses with built-in support for tool execution and JSON schema definitions using Zod.
- useChat: React hook managing message state, attachments (images), input handling, streaming state, and client-side tool renderers.
- Tool Calling Workflow:
  1. Developers define tool schemas (e.g. webSearch, getWeather, generateChart) using Zod.
  2. The LLM decides when a query requires tool execution, emitting structured tool call parameters.
  3. The SDK executes the tool function server-side or client-side, passes the tool execution result back to the model, and streams the final synthesis or renders a Generative UI widget directly in the component tree.`
  },
  {
    id: "doc-generative-ui-3",
    title: "Generative UI & Visual Widget Principles",
    category: "UI/UX",
    dateAdded: "2026-09-20",
    source: "Design System Guidelines",
    content: `Generative User Interface (GenUI) dynamically transforms raw unstructured LLM outputs into rich, interactive UI components instead of plain markdown text.
Supported Widgets:
1. Recharts Graphs: Automatically turns numerical data, model benchmark scores, financial metrics, or user datasets into responsive Bar, Line, or Pie charts.
2. Live Web Search Cards: Displays curated search result cards with domain badges, source links, and summaries.
3. Weather Forecast Card: Interactive visual card displaying temperature, condition icons, humidity, and wind speed.
4. Calculator Breakdown Card: Shows step-by-step mathematical calculations with formatted KaTeX formulas.
5. Code Playground: Formatted code blocks with syntax highlighting, copy-to-clipboard functionality, and execution previews.`
  },
  {
    id: "doc-groq-api-4",
    title: "Groq Llama 3 & Vision Models Overview",
    category: "LLM Providers",
    dateAdded: "2026-09-22",
    source: "Groq Developer Documentation",
    content: `Groq LPU (Language Processing Unit) offers high-speed inference for open-weights models like Meta Llama 3.
Key Supported Models:
- llama-3.3-70b-versatile: 70 billion parameter model optimized for complex reasoning, tool calling, and RAG synthesis.
- llama-3.2-11b-vision-instruct: Multimodal model supporting text and high-resolution image reasoning (diagram analysis, image description, chart reading).
- Performance: Ultra-low latency streaming exceeding 300 tokens/second, making interactive multimodal search instant and responsive.`
  }
];
