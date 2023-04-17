import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { MemoryVector } from "@/types/memoryVector";
// Import the legacy build of PDF.js
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.js";


export const docFromPdf = async (filePath: string, originalName: string) => {
  const loader = new PDFLoader(filePath)
  const docs = await loader.load()
  for (const doc of docs) {
    doc.metadata.originalName = originalName;
  }
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs, new OpenAIEmbeddings()
  )

  return vectorStore.memoryVectors
}

export const retrieverFromMemoryVectors = (memoryVectors: MemoryVector[]) => {
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings())
  vectorStore.memoryVectors = memoryVectors
  return vectorStore.asRetriever(3)
}
