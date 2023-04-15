import { DocumentFile } from "@/types/documentFile";

// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

const handler = async (req: Request): Promise<Response> => {
  try {
    console.log("OK");
    return new Response('ok');
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}

export default handler;
