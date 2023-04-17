import { NextApiRequest, NextApiResponse } from 'next';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { questionGeneratorTemplate, qaTemplate } from '@/utils/app/customPrompt';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import { ChatQABody, Message } from '@/types/chat';
import { ConversationalRetrievalQAChain, LLMChain, loadQAStuffChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { retrieverFromMemoryVectors } from '@/utils/server/createIndex';
import { CallbackManager } from 'langchain/callbacks';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { model, messages, key, prompt, temperature, vectorStore } = (await req.body) as ChatQABody;

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

    let chat_history: string[] = [];
    const question = messages.slice(-1)[0].content
    chat_history = messages.slice(0,-1).map(x => x.content)

    const streamingLLM = new ChatOpenAI({
      modelName: model.id ,temperature: temperatureToUse, streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token: string) {
          res.write(`${token}`);
        }
      })
    })
    const combineDocumentsChain = loadQAStuffChain(streamingLLM, {prompt: qaTemplate})

    const llm = new ChatOpenAI({modelName: model.id ,temperature: temperatureToUse})
    const questionGeneratorChain = new LLMChain({llm: llm, prompt: questionGeneratorTemplate})
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Transfer-Encoding': 'chunked',
    })
    const chain = new ConversationalRetrievalQAChain(
      {
        retriever: retrieverFromMemoryVectors(vectorStore),
        combineDocumentsChain: combineDocumentsChain,
        questionGeneratorChain: questionGeneratorChain
      },
    );
    const response = await chain.call({
      question, chat_history
    })
    res.end()
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
