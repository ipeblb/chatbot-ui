import {MemoryVectorStore} from "langchain/vectorstores/memory"
import {OpenAIEmbeddings} from "langchain/embeddings/openai"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
// Import the legacy build of PDF.js
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.js";


export const docFromPdf = async (filePath: string) => {
  const loader = new PDFLoader(filePath)
  const docs = await loader.load()
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs, new OpenAIEmbeddings()
  )

  return vectorStore.asRetriever()
}
